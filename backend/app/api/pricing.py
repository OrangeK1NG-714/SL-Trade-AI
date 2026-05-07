from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.price_calculator import (
    calculate_fob,
    calculate_cif,
    calculate_profit,
    get_exchange_rate,
)

router = APIRouter(prefix="/pricing", tags=["pricing"])


class PricingCalculateRequest(BaseModel):
    product_price_rmb: float
    quantity_tons: float
    inland_freight: float = 0
    customs_fee: float = 0
    port_charges: float = 0
    ocean_freight: float = 0
    insurance: float = 0
    target_margin: Optional[float] = None


@router.post("/calculate")
def calculate_pricing(data: PricingCalculateRequest):
    fob_result = calculate_fob(
        product_price_rmb=data.product_price_rmb,
        quantity_tons=data.quantity_tons,
        inland_freight=data.inland_freight,
        customs_fee=data.customs_fee,
        port_charges=data.port_charges,
    )

    cif_result = calculate_cif(
        fob_usd=fob_result["total_cost_usd"],
        ocean_freight=data.ocean_freight,
        insurance=data.insurance,
    )

    result = {
        "fob": fob_result,
        "cif": cif_result,
    }

    if data.target_margin is not None:
        profit_result = calculate_profit(
            cif_usd=cif_result["cif_usd"],
            target_margin=data.target_margin,
        )
        result["profit"] = profit_result

    return result


@router.get("/exchange-rate")
def exchange_rate():
    return get_exchange_rate()
