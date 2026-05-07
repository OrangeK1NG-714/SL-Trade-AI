from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Date, Enum

from app.database import Base


class PriceRecord(Base):
    __tablename__ = "price_records"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(100), nullable=False)
    product_grade = Column(String(100))
    price_usd = Column(Float)
    price_rmb = Column(Float)
    source = Column(String(200))
    recorded_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class PolicyNote(Base):
    __tablename__ = "policy_notes"

    id = Column(Integer, primary_key=True, index=True)
    country = Column(String(100), nullable=False)
    title = Column(String(500), nullable=False)
    content = Column(Text)
    category = Column(
        Enum("tariff", "regulation", "trade", name="policy_category"),
        nullable=False,
    )
    source = Column(String(300))
    published_date = Column(Date)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
