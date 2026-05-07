from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.inquiry import Inquiry

router = APIRouter(prefix="/inquiries", tags=["inquiries"])


class InquiryCreate(BaseModel):
    name: str
    company: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    product: Optional[str] = None
    message: Optional[str] = None


class InquiryResponse(BaseModel):
    id: int
    name: str
    company: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    country: Optional[str]
    product: Optional[str]
    message: Optional[str]
    status: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class InquiryStatusUpdate(BaseModel):
    status: str


@router.post("", response_model=InquiryResponse, status_code=201)
def create_inquiry(data: InquiryCreate, db: Session = Depends(get_db)):
    inquiry = Inquiry(**data.model_dump())
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry


@router.get("", response_model=list[InquiryResponse])
def list_inquiries(
    status: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(Inquiry)

    if status:
        query = query.filter(Inquiry.status == status)
    if country:
        query = query.filter(Inquiry.country == country)

    return query.order_by(Inquiry.created_at.desc()).offset(skip).limit(limit).all()


@router.put("/{inquiry_id}/status", response_model=InquiryResponse)
def update_inquiry_status(inquiry_id: int, data: InquiryStatusUpdate, db: Session = Depends(get_db)):
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    inquiry.status = data.status
    db.commit()
    db.refresh(inquiry)
    return inquiry
