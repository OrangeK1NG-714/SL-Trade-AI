from datetime import date, datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.logistics import Shipment, ShipmentEvent
from app.services.ai_service import ai_service

router = APIRouter(prefix="/logistics", tags=["logistics"])


class ShipmentCreate(BaseModel):
    customer_id: Optional[int] = None
    order_ref: Optional[str] = None
    shipping_line: Optional[str] = None
    container_no: Optional[str] = None
    bl_number: Optional[str] = None
    origin_port: Optional[str] = None
    dest_port: Optional[str] = None
    status: str = "booked"
    etd: Optional[date] = None
    eta: Optional[date] = None
    notes: Optional[str] = None


class ShipmentUpdate(BaseModel):
    customer_id: Optional[int] = None
    order_ref: Optional[str] = None
    shipping_line: Optional[str] = None
    container_no: Optional[str] = None
    bl_number: Optional[str] = None
    origin_port: Optional[str] = None
    dest_port: Optional[str] = None
    status: Optional[str] = None
    etd: Optional[date] = None
    eta: Optional[date] = None
    notes: Optional[str] = None


class ShipmentEventCreate(BaseModel):
    status: str
    location: Optional[str] = None
    description: Optional[str] = None
    event_date: datetime


class ShipmentEventResponse(BaseModel):
    id: int
    shipment_id: int
    status: str
    location: Optional[str]
    description: Optional[str]
    event_date: datetime

    model_config = {"from_attributes": True}


class ShipmentResponse(BaseModel):
    id: int
    customer_id: Optional[int]
    order_ref: Optional[str]
    shipping_line: Optional[str]
    container_no: Optional[str]
    bl_number: Optional[str]
    origin_port: Optional[str]
    dest_port: Optional[str]
    status: Optional[str]
    etd: Optional[date]
    eta: Optional[date]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ShipmentDetailResponse(ShipmentResponse):
    events: list[ShipmentEventResponse] = []


@router.get("/shipments", response_model=list[ShipmentResponse])
def list_shipments(
    status: Optional[str] = Query(None),
    customer_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(Shipment)

    if status:
        query = query.filter(Shipment.status == status)
    if customer_id:
        query = query.filter(Shipment.customer_id == customer_id)

    return query.order_by(Shipment.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/shipments/{shipment_id}", response_model=ShipmentDetailResponse)
def get_shipment(shipment_id: int, db: Session = Depends(get_db)):
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment


@router.post("/shipments", response_model=ShipmentResponse, status_code=201)
def create_shipment(data: ShipmentCreate, db: Session = Depends(get_db)):
    shipment = Shipment(**data.model_dump())
    db.add(shipment)
    db.commit()
    db.refresh(shipment)
    return shipment


@router.put("/shipments/{shipment_id}", response_model=ShipmentResponse)
def update_shipment(shipment_id: int, data: ShipmentUpdate, db: Session = Depends(get_db)):
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(shipment, field, value)

    db.commit()
    db.refresh(shipment)
    return shipment


@router.delete("/shipments/{shipment_id}")
def delete_shipment(shipment_id: int, db: Session = Depends(get_db)):
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    db.delete(shipment)
    db.commit()
    return {"detail": "Shipment deleted"}


@router.post("/shipments/{shipment_id}/events", response_model=ShipmentEventResponse, status_code=201)
def add_shipment_event(shipment_id: int, data: ShipmentEventCreate, db: Session = Depends(get_db)):
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    event = ShipmentEvent(shipment_id=shipment_id, **data.model_dump())
    db.add(event)

    shipment.status = data.status
    db.commit()
    db.refresh(event)
    return event


@router.post("/shipments/{shipment_id}/notify-template")
def generate_notify_template(shipment_id: int, db: Session = Depends(get_db)):
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    events = (
        db.query(ShipmentEvent)
        .filter(ShipmentEvent.shipment_id == shipment_id)
        .order_by(ShipmentEvent.event_date.desc())
        .all()
    )

    events_text = "\n".join(
        [f"- {e.event_date}: {e.status} at {e.location or 'N/A'} - {e.description or ''}"
         for e in events]
    ) or "No events recorded yet"

    system_prompt = (
        "You are a logistics coordinator for a plastics export company. "
        "Generate a professional customer notification email about their shipment status. "
        "Return ONLY the email body."
    )

    user_prompt = (
        f"Generate a shipment status notification for the customer.\n\n"
        f"Shipment details:\n"
        f"- Order Ref: {shipment.order_ref or 'N/A'}\n"
        f"- Container: {shipment.container_no or 'N/A'}\n"
        f"- B/L Number: {shipment.bl_number or 'N/A'}\n"
        f"- Shipping Line: {shipment.shipping_line or 'N/A'}\n"
        f"- Route: {shipment.origin_port or 'N/A'} -> {shipment.dest_port or 'N/A'}\n"
        f"- Status: {shipment.status}\n"
        f"- ETD: {shipment.etd or 'N/A'}\n"
        f"- ETA: {shipment.eta or 'N/A'}\n\n"
        f"Recent events:\n{events_text}"
    )

    notification = ai_service.generate_text(system_prompt, user_prompt)

    return {
        "shipment_id": shipment.id,
        "order_ref": shipment.order_ref,
        "notification": notification,
    }
