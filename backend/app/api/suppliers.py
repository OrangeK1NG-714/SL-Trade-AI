import json
from datetime import date, datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.supplier import Supplier, SupplierQuote
from app.services.ai_service import ai_service

router = APIRouter(prefix="/suppliers", tags=["suppliers"])


class SupplierCreate(BaseModel):
    name: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    main_products: Optional[str] = None
    rating: Optional[float] = 3.0
    notes: Optional[str] = None


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    main_products: Optional[str] = None
    rating: Optional[float] = None
    notes: Optional[str] = None


class QuoteCreate(BaseModel):
    product_name: str
    product_category: Optional[str] = None
    price_per_ton: float
    moq_tons: Optional[float] = None
    delivery_days: Optional[int] = None
    valid_until: Optional[date] = None
    notes: Optional[str] = None


class QuoteResponse(BaseModel):
    id: int
    supplier_id: int
    product_name: str
    product_category: Optional[str]
    price_per_ton: float
    moq_tons: Optional[float]
    delivery_days: Optional[int]
    valid_until: Optional[date]
    notes: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class SupplierResponse(BaseModel):
    id: int
    name: str
    contact_person: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    location: Optional[str]
    main_products: Optional[str]
    rating: Optional[float]
    notes: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class SupplierDetailResponse(SupplierResponse):
    quotes: list[QuoteResponse] = []


class AIRecommendRequest(BaseModel):
    product: str
    quantity_tons: float = 25
    priority: str = "price"


@router.get("", response_model=list[SupplierResponse])
def list_suppliers(
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(Supplier)

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            (Supplier.name.ilike(pattern))
            | (Supplier.main_products.ilike(pattern))
            | (Supplier.location.ilike(pattern))
        )

    return query.order_by(Supplier.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/compare")
def compare_suppliers(
    product: str = Query(...),
    db: Session = Depends(get_db),
):
    quotes = (
        db.query(SupplierQuote)
        .filter(SupplierQuote.product_name.ilike(f"%{product}%"))
        .all()
    )

    comparisons = []
    for quote in quotes:
        supplier = db.query(Supplier).filter(Supplier.id == quote.supplier_id).first()
        comparisons.append({
            "supplier_id": supplier.id if supplier else None,
            "supplier_name": supplier.name if supplier else "Unknown",
            "supplier_rating": supplier.rating if supplier else None,
            "supplier_location": supplier.location if supplier else None,
            "product_name": quote.product_name,
            "product_category": quote.product_category,
            "price_per_ton": quote.price_per_ton,
            "moq_tons": quote.moq_tons,
            "delivery_days": quote.delivery_days,
            "valid_until": str(quote.valid_until) if quote.valid_until else None,
        })

    comparisons.sort(key=lambda x: x["price_per_ton"])

    return {"product": product, "quotes_count": len(comparisons), "comparisons": comparisons}


@router.get("/{supplier_id}", response_model=SupplierDetailResponse)
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier


@router.post("", response_model=SupplierResponse, status_code=201)
def create_supplier(data: SupplierCreate, db: Session = Depends(get_db)):
    supplier = Supplier(**data.model_dump())
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier


@router.put("/{supplier_id}", response_model=SupplierResponse)
def update_supplier(supplier_id: int, data: SupplierUpdate, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(supplier, field, value)

    db.commit()
    db.refresh(supplier)
    return supplier


@router.delete("/{supplier_id}")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    db.delete(supplier)
    db.commit()
    return {"detail": "Supplier deleted"}


@router.post("/{supplier_id}/quotes", response_model=QuoteResponse, status_code=201)
def add_quote(supplier_id: int, data: QuoteCreate, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    quote = SupplierQuote(supplier_id=supplier_id, **data.model_dump())
    db.add(quote)
    db.commit()
    db.refresh(quote)
    return quote


@router.post("/ai-recommend")
def ai_recommend_supplier(data: AIRecommendRequest, db: Session = Depends(get_db)):
    quotes = (
        db.query(SupplierQuote)
        .filter(SupplierQuote.product_name.ilike(f"%{data.product}%"))
        .all()
    )

    supplier_data = []
    for quote in quotes:
        supplier = db.query(Supplier).filter(Supplier.id == quote.supplier_id).first()
        supplier_data.append({
            "supplier_name": supplier.name if supplier else "Unknown",
            "rating": supplier.rating if supplier else 0,
            "location": supplier.location if supplier else "Unknown",
            "price_per_ton_rmb": quote.price_per_ton,
            "moq_tons": quote.moq_tons,
            "delivery_days": quote.delivery_days,
        })

    if not supplier_data:
        return {
            "recommendation": "No supplier quotes found for this product. Add supplier quotes first.",
            "suppliers_analyzed": 0,
        }

    supplier_text = "\n".join(
        [f"- {s['supplier_name']}: RMB {s['price_per_ton_rmb']}/ton, "
         f"Rating: {s['rating']}/5, MOQ: {s['moq_tons']}T, "
         f"Delivery: {s['delivery_days']} days, Location: {s['location']}"
         for s in supplier_data]
    )

    system_prompt = (
        "You are a procurement advisor for a plastics export company. "
        "Analyze the supplier options and recommend the best one. "
        "Return a JSON object with:\n"
        '- "recommended_supplier": name of the best supplier\n'
        '- "reason": detailed explanation\n'
        '- "alternatives": array of alternative supplier names with brief notes\n\n'
        "Return ONLY valid JSON."
    )

    user_prompt = (
        f"Recommend the best supplier for {data.product}.\n"
        f"Order quantity: {data.quantity_tons} tons\n"
        f"Priority: {data.priority}\n\n"
        f"Available suppliers:\n{supplier_text}"
    )

    response = ai_service.generate_text(system_prompt, user_prompt)

    try:
        result = json.loads(response)
    except json.JSONDecodeError:
        result = {"recommendation": response}

    result["suppliers_analyzed"] = len(supplier_data)
    return result
