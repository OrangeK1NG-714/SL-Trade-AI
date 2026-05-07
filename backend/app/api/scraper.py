from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer

router = APIRouter(prefix="/scraper", tags=["scraper"])

MOCK_SEARCH_RESULTS = [
    {
        "name": "Ibrahim Osei",
        "company": "West Africa Plastics Ltd",
        "country": "Ghana",
        "email": "ibrahim@waplastics.com",
        "phone": "+233-20-1234567",
        "source": "Alibaba",
        "products_interested": "PP Homopolymer, HDPE",
        "company_size": "Medium (50-200 employees)",
    },
    {
        "name": "Amina Diallo",
        "company": "Sahel Industries SARL",
        "country": "Senegal",
        "email": "amina@sahelindustries.sn",
        "phone": "+221-77-8901234",
        "source": "Made-in-China",
        "products_interested": "PVC Resin, PP Copolymer",
        "company_size": "Small (10-50 employees)",
    },
    {
        "name": "Chukwuma Okafor",
        "company": "Lagos Polymer Imports",
        "country": "Nigeria",
        "email": "chukwuma@lagospolymer.ng",
        "phone": "+234-803-4567890",
        "source": "Global Sources",
        "products_interested": "LDPE, LLDPE",
        "company_size": "Large (200+ employees)",
    },
    {
        "name": "Jean-Pierre Kouassi",
        "company": "Abidjan Trading Co",
        "country": "Ivory Coast",
        "email": "jp@abidjantrading.ci",
        "phone": "+225-07-1234567",
        "source": "TradeKey",
        "products_interested": "PP Homopolymer",
        "company_size": "Medium (50-200 employees)",
    },
    {
        "name": "Fatima Mwangi",
        "company": "East Africa Resins",
        "country": "Kenya",
        "email": "fatima@earesins.co.ke",
        "phone": "+254-722-345678",
        "source": "Alibaba",
        "products_interested": "HDPE, PVC Resin, PP",
        "company_size": "Medium (50-200 employees)",
    },
    {
        "name": "Mohamed Ali Hassan",
        "company": "Dar Plastics Corp",
        "country": "Tanzania",
        "email": "mhassan@darplastics.co.tz",
        "phone": "+255-754-234567",
        "source": "Made-in-China",
        "products_interested": "PP Homopolymer, HDPE",
        "company_size": "Small (10-50 employees)",
    },
]


class SearchRequest(BaseModel):
    query: str = ""
    country: Optional[str] = None
    product: Optional[str] = None
    platform: Optional[str] = None
    limit: int = 10


class ImportRequest(BaseModel):
    leads: list[dict]


@router.post("/search")
def search_buyers(data: SearchRequest):
    results = MOCK_SEARCH_RESULTS.copy()

    if data.country:
        results = [r for r in results if data.country.lower() in r["country"].lower()]

    if data.product:
        results = [
            r for r in results
            if data.product.lower() in r["products_interested"].lower()
        ]

    if data.platform:
        results = [r for r in results if data.platform.lower() in r["source"].lower()]

    results = results[:data.limit]

    return {
        "query": data.query,
        "filters": {
            "country": data.country,
            "product": data.product,
            "platform": data.platform,
        },
        "total": len(results),
        "results": results,
        "source": "mock",
        "note": "This returns simulated data. Integrate real B2B platform APIs for production.",
    }


@router.post("/import-to-crm")
def import_to_crm(data: ImportRequest, db: Session = Depends(get_db)):
    imported = []
    skipped = []

    for lead in data.leads:
        email = lead.get("email", "")
        if email:
            existing = db.query(Customer).filter(Customer.email == email).first()
            if existing:
                skipped.append({"email": email, "reason": "Already exists in CRM"})
                continue

        customer = Customer(
            name=lead.get("name", "Unknown"),
            company=lead.get("company", ""),
            country=lead.get("country", ""),
            email=email,
            phone=lead.get("phone", ""),
            source=lead.get("source", "B2B Platform"),
            status="new",
            notes=f"Imported from scraper. Products interested: {lead.get('products_interested', 'N/A')}",
        )
        db.add(customer)
        imported.append({"name": customer.name, "email": customer.email})

    db.commit()

    return {
        "imported_count": len(imported),
        "skipped_count": len(skipped),
        "imported": imported,
        "skipped": skipped,
    }
