from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship

from app.database import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(300), nullable=False)
    contact_person = Column(String(200))
    phone = Column(String(50))
    email = Column(String(200))
    location = Column(String(300))
    main_products = Column(Text)
    rating = Column(Float, default=3.0)
    notes = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    quotes = relationship("SupplierQuote", back_populates="supplier", cascade="all, delete-orphan")


class SupplierQuote(Base):
    __tablename__ = "supplier_quotes"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    product_name = Column(String(200), nullable=False)
    product_category = Column(String(100))
    price_per_ton = Column(Float, nullable=False)
    moq_tons = Column(Float)
    delivery_days = Column(Integer)
    valid_until = Column(Date)
    notes = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    supplier = relationship("Supplier", back_populates="quotes")
