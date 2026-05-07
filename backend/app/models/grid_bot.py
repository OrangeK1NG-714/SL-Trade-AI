from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.database import Base


class GridBot(Base):
    __tablename__ = "grid_bots"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), nullable=False, default="BTC/USDT")
    lower_price = Column(Float, nullable=False)
    upper_price = Column(Float, nullable=False)
    grid_count = Column(Integer, nullable=False)
    investment_per_grid = Column(Float, nullable=False)
    total_investment = Column(Float, nullable=False)
    status = Column(
        Enum("idle", "running", "stopped", name="bot_status"),
        default="idle",
    )
    current_price = Column(Float, default=0)
    realized_pnl = Column(Float, default=0)
    unrealized_pnl = Column(Float, default=0)
    total_trades = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    orders = relationship("GridOrder", back_populates="bot", cascade="all, delete-orphan")
    snapshots = relationship("BotSnapshot", back_populates="bot", cascade="all, delete-orphan")


class GridOrder(Base):
    __tablename__ = "grid_orders"

    id = Column(Integer, primary_key=True, index=True)
    bot_id = Column(Integer, ForeignKey("grid_bots.id"), nullable=False)
    side = Column(Enum("buy", "sell", name="order_side"), nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Float, nullable=False)
    status = Column(
        Enum("pending", "filled", "cancelled", name="order_status"),
        default="pending",
    )
    grid_level = Column(Integer, nullable=False)
    filled_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    bot = relationship("GridBot", back_populates="orders")


class BotSnapshot(Base):
    __tablename__ = "bot_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    bot_id = Column(Integer, ForeignKey("grid_bots.id"), nullable=False)
    price = Column(Float, nullable=False)
    total_assets = Column(Float, nullable=False)
    realized_pnl = Column(Float, nullable=False)
    unrealized_pnl = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    bot = relationship("GridBot", back_populates="snapshots")
