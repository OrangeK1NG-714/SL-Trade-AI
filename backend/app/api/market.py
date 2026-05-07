from datetime import date, datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.market import PriceRecord, PolicyNote
from app.services.market_monitor import get_price_summary, analyze_trend

router = APIRouter(prefix="/market", tags=["market"])


class PriceRecordCreate(BaseModel):
    product_name: str
    product_grade: Optional[str] = None
    price_usd: Optional[float] = None
    price_rmb: Optional[float] = None
    source: Optional[str] = None
    recorded_date: date


class PriceRecordResponse(BaseModel):
    id: int
    product_name: str
    product_grade: Optional[str]
    price_usd: Optional[float]
    price_rmb: Optional[float]
    source: Optional[str]
    recorded_date: date
    created_at: datetime

    model_config = {"from_attributes": True}


class BatchPriceCreate(BaseModel):
    records: list[PriceRecordCreate]


class AIAnalysisRequest(BaseModel):
    product: str
    prices: Optional[list[dict]] = None


class PolicyNoteCreate(BaseModel):
    country: str
    title: str
    content: Optional[str] = None
    category: str
    source: Optional[str] = None
    published_date: Optional[date] = None


class PolicyNoteResponse(BaseModel):
    id: int
    country: str
    title: str
    content: Optional[str]
    category: str
    source: Optional[str]
    published_date: Optional[date]
    created_at: datetime

    model_config = {"from_attributes": True}


@router.get("/prices", response_model=list[PriceRecordResponse])
def list_prices(
    product: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    query = db.query(PriceRecord)

    if product:
        query = query.filter(PriceRecord.product_name == product)
    if date_from:
        query = query.filter(PriceRecord.recorded_date >= date_from)
    if date_to:
        query = query.filter(PriceRecord.recorded_date <= date_to)

    return query.order_by(PriceRecord.recorded_date.desc()).offset(skip).limit(limit).all()


@router.post("/prices", response_model=PriceRecordResponse, status_code=201)
def create_price_record(data: PriceRecordCreate, db: Session = Depends(get_db)):
    record = PriceRecord(**data.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.post("/prices/batch")
def batch_create_prices(data: BatchPriceCreate, db: Session = Depends(get_db)):
    records = []
    for item in data.records:
        record = PriceRecord(**item.model_dump())
        db.add(record)
        records.append(record)

    db.commit()
    return {"count": len(records), "detail": "Batch import successful"}


@router.post("/ai-analysis")
def ai_price_analysis(data: AIAnalysisRequest, db: Session = Depends(get_db)):
    if data.prices:
        analysis = analyze_trend(data.prices)
    else:
        db_records = (
            db.query(PriceRecord)
            .filter(PriceRecord.product_name == data.product)
            .order_by(PriceRecord.recorded_date.desc())
            .limit(30)
            .all()
        )
        prices = [
            {
                "date": str(r.recorded_date),
                "price_usd": r.price_usd,
                "price_rmb": r.price_rmb,
            }
            for r in db_records
        ]
        analysis = analyze_trend(prices)

    summary = get_price_summary(db, data.product)

    return {
        "product": data.product,
        "summary": summary,
        "analysis": analysis,
    }


@router.get("/policies", response_model=list[PolicyNoteResponse])
def list_policies(
    country: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(PolicyNote)

    if country:
        query = query.filter(PolicyNote.country == country)
    if category:
        query = query.filter(PolicyNote.category == category)

    return query.order_by(PolicyNote.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/policies", response_model=PolicyNoteResponse, status_code=201)
def create_policy(data: PolicyNoteCreate, db: Session = Depends(get_db)):
    policy = PolicyNote(**data.model_dump())
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy
