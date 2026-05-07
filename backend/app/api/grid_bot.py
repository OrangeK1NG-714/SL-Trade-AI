from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.grid_bot import GridBot, GridOrder, BotSnapshot
from app.services.grid_engine import grid_engine
from app.services.bot_runner import bot_runner

router = APIRouter(prefix="/grid-bot", tags=["grid-bot"])


class BotCreate(BaseModel):
    symbol: str = "BTC/USDT"
    lower_price: float
    upper_price: float
    grid_count: int
    investment_per_grid: float


class BotResponse(BaseModel):
    id: int
    symbol: str
    lower_price: float
    upper_price: float
    grid_count: int
    investment_per_grid: float
    total_investment: float
    status: str
    current_price: float
    realized_pnl: float
    unrealized_pnl: float
    total_trades: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    bot_id: int
    side: str
    price: float
    quantity: float
    status: str
    grid_level: int
    filled_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


class SnapshotResponse(BaseModel):
    id: int
    price: float
    total_assets: float
    realized_pnl: float
    unrealized_pnl: float
    created_at: datetime

    model_config = {"from_attributes": True}


@router.get("", response_model=list[BotResponse])
def list_bots(db: Session = Depends(get_db)):
    return db.query(GridBot).order_by(GridBot.created_at.desc()).all()


@router.post("", response_model=BotResponse, status_code=201)
def create_bot(data: BotCreate, db: Session = Depends(get_db)):
    if data.lower_price >= data.upper_price:
        raise HTTPException(400, "lower_price must be less than upper_price")
    if data.grid_count < 2:
        raise HTTPException(400, "grid_count must be at least 2")

    total = data.investment_per_grid * data.grid_count
    bot = GridBot(
        symbol=data.symbol,
        lower_price=data.lower_price,
        upper_price=data.upper_price,
        grid_count=data.grid_count,
        investment_per_grid=data.investment_per_grid,
        total_investment=total,
    )
    db.add(bot)
    db.commit()
    db.refresh(bot)
    return bot


@router.get("/{bot_id}", response_model=BotResponse)
def get_bot(bot_id: int, db: Session = Depends(get_db)):
    bot = db.query(GridBot).filter(GridBot.id == bot_id).first()
    if not bot:
        raise HTTPException(404, "Bot not found")
    return bot


@router.post("/{bot_id}/start")
async def start_bot(bot_id: int, db: Session = Depends(get_db)):
    bot = db.query(GridBot).filter(GridBot.id == bot_id).first()
    if not bot:
        raise HTTPException(404, "Bot not found")
    if bot.status == "running":
        raise HTTPException(400, "Bot is already running")

    bot.status = "running"
    db.commit()

    grid_engine.create_grid_orders(bot, db)
    await bot_runner.start(bot_id)

    return {"detail": "Bot started", "bot_id": bot_id}


@router.post("/{bot_id}/stop")
async def stop_bot(bot_id: int, db: Session = Depends(get_db)):
    bot = db.query(GridBot).filter(GridBot.id == bot_id).first()
    if not bot:
        raise HTTPException(404, "Bot not found")

    bot.status = "stopped"
    db.commit()
    await bot_runner.stop(bot_id)

    return {"detail": "Bot stopped", "bot_id": bot_id}


@router.get("/{bot_id}/orders", response_model=list[OrderResponse])
def get_orders(bot_id: int, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(GridOrder).filter(GridOrder.bot_id == bot_id)
    if status:
        query = query.filter(GridOrder.status == status)
    return query.order_by(GridOrder.created_at.desc()).limit(100).all()


@router.get("/{bot_id}/snapshots", response_model=list[SnapshotResponse])
def get_snapshots(bot_id: int, db: Session = Depends(get_db)):
    return (
        db.query(BotSnapshot)
        .filter(BotSnapshot.bot_id == bot_id)
        .order_by(BotSnapshot.created_at.desc())
        .limit(100)
        .all()
    )


@router.post("/{bot_id}/tick")
def manual_tick(bot_id: int, db: Session = Depends(get_db)):
    bot = db.query(GridBot).filter(GridBot.id == bot_id).first()
    if not bot:
        raise HTTPException(404, "Bot not found")

    result = grid_engine.tick(bot, db)
    return result


@router.delete("/{bot_id}")
async def delete_bot(bot_id: int, db: Session = Depends(get_db)):
    bot = db.query(GridBot).filter(GridBot.id == bot_id).first()
    if not bot:
        raise HTTPException(404, "Bot not found")

    if bot.status == "running":
        await bot_runner.stop(bot_id)

    db.delete(bot)
    db.commit()
    return {"detail": "Bot deleted"}
