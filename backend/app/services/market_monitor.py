from datetime import date

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.market import PriceRecord
from app.services.ai_service import ai_service


def get_price_summary(db: Session, product: str) -> dict:
    records = (
        db.query(PriceRecord)
        .filter(PriceRecord.product_name == product)
        .order_by(PriceRecord.recorded_date.desc())
        .limit(30)
        .all()
    )

    if not records:
        return {
            "product": product,
            "record_count": 0,
            "latest_price_usd": None,
            "latest_price_rmb": None,
            "avg_price_usd": None,
            "avg_price_rmb": None,
            "min_price_usd": None,
            "max_price_usd": None,
            "date_range": None,
        }

    usd_prices = [r.price_usd for r in records if r.price_usd is not None]
    rmb_prices = [r.price_rmb for r in records if r.price_rmb is not None]

    return {
        "product": product,
        "record_count": len(records),
        "latest_price_usd": records[0].price_usd,
        "latest_price_rmb": records[0].price_rmb,
        "latest_date": str(records[0].recorded_date),
        "avg_price_usd": round(sum(usd_prices) / len(usd_prices), 2) if usd_prices else None,
        "avg_price_rmb": round(sum(rmb_prices) / len(rmb_prices), 2) if rmb_prices else None,
        "min_price_usd": min(usd_prices) if usd_prices else None,
        "max_price_usd": max(usd_prices) if usd_prices else None,
        "date_range": {
            "from": str(records[-1].recorded_date),
            "to": str(records[0].recorded_date),
        },
    }


def analyze_trend(prices: list) -> str:
    if not prices:
        return "No price data available for analysis."

    price_text = "\n".join(
        [f"Date: {p.get('date', 'N/A')}, USD: {p.get('price_usd', 'N/A')}, RMB: {p.get('price_rmb', 'N/A')}"
         for p in prices]
    )

    system_prompt = (
        "You are a plastics market analyst specializing in African import markets. "
        "Analyze the following price data for plastic raw materials and provide: "
        "1. Overall trend direction, "
        "2. Key price movement observations, "
        "3. Potential factors driving the trend, "
        "4. Recommendation for buyers/sellers."
    )

    user_prompt = f"Analyze these plastic raw material prices:\n\n{price_text}"

    return ai_service.generate_text(system_prompt, user_prompt)
