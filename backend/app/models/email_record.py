from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.database import Base


class EmailRecord(Base):
    __tablename__ = "email_records"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    to_email = Column(String(200), nullable=False)
    to_name = Column(String(200))
    to_company = Column(String(300))
    country = Column(String(100))
    language = Column(
        Enum("en", "fr", "pt", name="email_language"),
        default="en",
    )
    product = Column(String(200))
    tone = Column(
        Enum("professional", "friendly", "urgent", name="email_tone"),
        default="professional",
    )
    subject = Column(String(500))
    body = Column(Text)
    status = Column(
        Enum("draft", "sent", name="email_status"),
        default="draft",
    )
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    customer = relationship("Customer", back_populates="email_records")
