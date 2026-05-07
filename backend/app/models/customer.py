from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    company = Column(String(300))
    country = Column(String(100))
    email = Column(String(200))
    phone = Column(String(50))
    whatsapp = Column(String(50))
    source = Column(String(100))
    intent_score = Column(Float, default=0)
    status = Column(
        Enum("new", "contacted", "negotiating", "closed", "lost", name="customer_status"),
        default="new",
    )
    notes = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    communications = relationship("Communication", back_populates="customer", cascade="all, delete-orphan")
    email_records = relationship("EmailRecord", back_populates="customer")
    shipments = relationship("Shipment", back_populates="customer")


class Communication(Base):
    __tablename__ = "communications"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    type = Column(
        Enum("email", "whatsapp", "phone", "meeting", name="comm_type"),
        nullable=False,
    )
    direction = Column(
        Enum("inbound", "outbound", name="comm_direction"),
        nullable=False,
    )
    content = Column(Text)
    sentiment = Column(String(50))
    intent_score = Column(Float)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    customer = relationship("Customer", back_populates="communications")
