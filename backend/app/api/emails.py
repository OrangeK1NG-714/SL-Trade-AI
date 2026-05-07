from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.email_record import EmailRecord
from app.services.email_generator import generate_cold_email

router = APIRouter(prefix="/emails", tags=["emails"])


class EmailGenerateRequest(BaseModel):
    customer_info: dict
    language: str = "en"
    product: str = "PP Homopolymer"
    tone: str = "professional"
    to_email: Optional[str] = None
    customer_id: Optional[int] = None


class BatchEmailRequest(BaseModel):
    customers: list[dict]
    language: str = "en"
    product: str = "PP Homopolymer"
    tone: str = "professional"


class EmailResponse(BaseModel):
    id: int
    customer_id: Optional[int]
    to_email: str
    to_name: Optional[str]
    to_company: Optional[str]
    country: Optional[str]
    language: Optional[str]
    product: Optional[str]
    tone: Optional[str]
    subject: Optional[str]
    body: Optional[str]
    status: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class EmailStatusUpdate(BaseModel):
    status: str


@router.post("/generate")
def generate_email(data: EmailGenerateRequest, db: Session = Depends(get_db)):
    result = generate_cold_email(
        customer_info=data.customer_info,
        language=data.language,
        product=data.product,
        tone=data.tone,
    )

    record = EmailRecord(
        customer_id=data.customer_id,
        to_email=data.to_email or data.customer_info.get("email", ""),
        to_name=data.customer_info.get("name", ""),
        to_company=data.customer_info.get("company", ""),
        country=data.customer_info.get("country", ""),
        language=data.language,
        product=data.product,
        tone=data.tone,
        subject=result["subject"],
        body=result["body"],
        status="draft",
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "subject": result["subject"],
        "body": result["body"],
        "language": data.language,
        "tone": data.tone,
    }


@router.post("/batch-generate")
def batch_generate_emails(data: BatchEmailRequest, db: Session = Depends(get_db)):
    results = []

    for customer_info in data.customers:
        result = generate_cold_email(
            customer_info=customer_info,
            language=data.language,
            product=data.product,
            tone=data.tone,
        )

        record = EmailRecord(
            to_email=customer_info.get("email", ""),
            to_name=customer_info.get("name", ""),
            to_company=customer_info.get("company", ""),
            country=customer_info.get("country", ""),
            language=data.language,
            product=data.product,
            tone=data.tone,
            subject=result["subject"],
            body=result["body"],
            status="draft",
        )
        db.add(record)

        results.append({
            "customer_name": customer_info.get("name", ""),
            "subject": result["subject"],
            "body": result["body"],
        })

    db.commit()

    return {"count": len(results), "emails": results}


@router.get("", response_model=list[EmailResponse])
def list_emails(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    return (
        db.query(EmailRecord)
        .order_by(EmailRecord.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.put("/{email_id}/status", response_model=EmailResponse)
def update_email_status(email_id: int, data: EmailStatusUpdate, db: Session = Depends(get_db)):
    record = db.query(EmailRecord).filter(EmailRecord.id == email_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Email record not found")

    record.status = data.status
    db.commit()
    db.refresh(record)
    return record
