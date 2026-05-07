from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Text, DateTime, Enum

from app.database import Base


class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    company = Column(String(300))
    email = Column(String(200))
    phone = Column(String(50))
    country = Column(String(100))
    product = Column(String(200))
    message = Column(Text)
    status = Column(
        Enum("new", "processing", "replied", "closed", name="inquiry_status"),
        default="new",
    )
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
