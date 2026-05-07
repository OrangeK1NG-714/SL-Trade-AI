import json
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer, Communication
from app.services.ai_service import ai_service

router = APIRouter(prefix="/customers", tags=["customers"])


class CustomerCreate(BaseModel):
    name: str
    company: Optional[str] = None
    country: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    source: Optional[str] = None
    intent_score: Optional[float] = 0
    status: Optional[str] = "new"
    notes: Optional[str] = None


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    country: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    source: Optional[str] = None
    intent_score: Optional[float] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class CommunicationCreate(BaseModel):
    type: str
    direction: str
    content: Optional[str] = None
    sentiment: Optional[str] = None
    intent_score: Optional[float] = None


class CommunicationResponse(BaseModel):
    id: int
    customer_id: int
    type: str
    direction: str
    content: Optional[str]
    sentiment: Optional[str]
    intent_score: Optional[float]
    created_at: datetime

    model_config = {"from_attributes": True}


class CustomerResponse(BaseModel):
    id: int
    name: str
    company: Optional[str]
    country: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    whatsapp: Optional[str]
    source: Optional[str]
    intent_score: Optional[float]
    status: Optional[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CustomerDetailResponse(CustomerResponse):
    communications: list[CommunicationResponse] = []


@router.get("", response_model=list[CustomerResponse])
def list_customers(
    search: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(Customer)

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            (Customer.name.ilike(pattern))
            | (Customer.company.ilike(pattern))
            | (Customer.email.ilike(pattern))
        )
    if country:
        query = query.filter(Customer.country == country)
    if status:
        query = query.filter(Customer.status == status)

    return query.order_by(Customer.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{customer_id}", response_model=CustomerDetailResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.post("", response_model=CustomerResponse, status_code=201)
def create_customer(data: CustomerCreate, db: Session = Depends(get_db)):
    customer = Customer(**data.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(customer_id: int, data: CustomerUpdate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(customer, field, value)

    customer.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(customer)
    return customer


@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    db.delete(customer)
    db.commit()
    return {"detail": "Customer deleted"}


@router.post("/{customer_id}/communications", response_model=CommunicationResponse, status_code=201)
def add_communication(customer_id: int, data: CommunicationCreate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    comm = Communication(customer_id=customer_id, **data.model_dump())
    db.add(comm)
    db.commit()
    db.refresh(comm)
    return comm


@router.post("/{customer_id}/ai-score")
def ai_score_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    communications = (
        db.query(Communication)
        .filter(Communication.customer_id == customer_id)
        .order_by(Communication.created_at.desc())
        .limit(10)
        .all()
    )

    comm_history = "\n".join(
        [f"[{c.type}/{c.direction}] {c.content or 'No content'}" for c in communications]
    )

    system_prompt = (
        "You are a sales intelligence AI for a plastics export company selling to Africa. "
        "Evaluate the customer and return a JSON object with:\n"
        '- "score": integer 0-100 representing deal closing probability\n'
        '- "analysis": string explaining the score\n'
        '- "recommendations": array of strings with action items\n\n'
        "Return ONLY valid JSON."
    )

    user_prompt = (
        f"Evaluate this customer's deal closing probability:\n\n"
        f"Name: {customer.name}\n"
        f"Company: {customer.company or 'N/A'}\n"
        f"Country: {customer.country or 'N/A'}\n"
        f"Status: {customer.status}\n"
        f"Current Score: {customer.intent_score}\n"
        f"Source: {customer.source or 'N/A'}\n\n"
        f"Communication History:\n{comm_history or 'No communications yet'}"
    )

    response = ai_service.generate_text(system_prompt, user_prompt)

    try:
        result = json.loads(response)
    except json.JSONDecodeError:
        result = {
            "score": 50,
            "analysis": response,
            "recommendations": ["Follow up with the customer within 48 hours"],
        }

    if "score" in result:
        customer.intent_score = result["score"]
        db.commit()

    return result
