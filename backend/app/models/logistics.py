from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.database import Base


class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    order_ref = Column(String(100))
    shipping_line = Column(String(200))
    container_no = Column(String(50))
    bl_number = Column(String(50))
    origin_port = Column(String(200))
    dest_port = Column(String(200))
    status = Column(
        Enum("booked", "loaded", "in_transit", "arrived", "delivered", name="shipment_status"),
        default="booked",
    )
    etd = Column(Date)
    eta = Column(Date)
    notes = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    customer = relationship("Customer", back_populates="shipments")
    events = relationship("ShipmentEvent", back_populates="shipment", cascade="all, delete-orphan")


class ShipmentEvent(Base):
    __tablename__ = "shipment_events"

    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    status = Column(String(100), nullable=False)
    location = Column(String(300))
    description = Column(Text)
    event_date = Column(DateTime, nullable=False)

    shipment = relationship("Shipment", back_populates="events")
