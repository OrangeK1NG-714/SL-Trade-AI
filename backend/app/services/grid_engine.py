import random
import math
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.grid_bot import GridBot, GridOrder, BotSnapshot


class GridEngine:
    def __init__(self):
        self._price_state: dict[int, float] = {}

    def create_grid_orders(self, bot: GridBot, db: Session) -> list[GridOrder]:
        grid_step = (bot.upper_price - bot.lower_price) / bot.grid_count
        mid_price = (bot.lower_price + bot.upper_price) / 2

        self._price_state[bot.id] = mid_price
        bot.current_price = mid_price

        orders = []
        for i in range(bot.grid_count + 1):
            price = bot.lower_price + i * grid_step
            price = round(price, 2)
            quantity = round(bot.investment_per_grid / price, 6)

            side = "buy" if price < mid_price else "sell"
            if abs(price - mid_price) < grid_step * 0.1:
                continue

            order = GridOrder(
                bot_id=bot.id,
                side=side,
                price=price,
                quantity=quantity,
                status="pending",
                grid_level=i,
            )
            db.add(order)
            orders.append(order)

        db.commit()
        return orders

    def simulate_price(self, bot_id: int, lower: float, upper: float) -> float:
        current = self._price_state.get(bot_id, (lower + upper) / 2)
        mid = (lower + upper) / 2
        price_range = upper - lower

        noise = random.gauss(0, price_range * 0.02)
        mean_reversion = (mid - current) * 0.05
        new_price = current + noise + mean_reversion

        new_price = max(lower * 0.95, min(upper * 1.05, new_price))
        new_price = round(new_price, 2)

        self._price_state[bot_id] = new_price
        return new_price

    def tick(self, bot: GridBot, db: Session) -> dict:
        new_price = self.simulate_price(bot.id, bot.lower_price, bot.upper_price)
        bot.current_price = new_price

        filled_orders = []
        new_orders = []

        pending_orders = (
            db.query(GridOrder)
            .filter(GridOrder.bot_id == bot.id, GridOrder.status == "pending")
            .all()
        )

        grid_step = (bot.upper_price - bot.lower_price) / bot.grid_count

        for order in pending_orders:
            triggered = False
            if order.side == "buy" and new_price <= order.price:
                triggered = True
            elif order.side == "sell" and new_price >= order.price:
                triggered = True

            if triggered:
                order.status = "filled"
                order.filled_at = datetime.now(timezone.utc)
                filled_orders.append(order)
                bot.total_trades += 1

                if order.side == "buy":
                    profit_per_grid = order.quantity * grid_step
                    bot.realized_pnl += profit_per_grid

                    new_sell_price = round(order.price + grid_step, 2)
                    if new_sell_price <= bot.upper_price:
                        new_order = GridOrder(
                            bot_id=bot.id,
                            side="sell",
                            price=new_sell_price,
                            quantity=order.quantity,
                            status="pending",
                            grid_level=order.grid_level + 1,
                        )
                        db.add(new_order)
                        new_orders.append(new_order)
                else:
                    new_buy_price = round(order.price - grid_step, 2)
                    if new_buy_price >= bot.lower_price:
                        new_order = GridOrder(
                            bot_id=bot.id,
                            side="buy",
                            price=new_buy_price,
                            quantity=order.quantity,
                            status="pending",
                            grid_level=order.grid_level - 1,
                        )
                        db.add(new_order)
                        new_orders.append(new_order)

        pending_buy = (
            db.query(GridOrder)
            .filter(
                GridOrder.bot_id == bot.id,
                GridOrder.status == "pending",
                GridOrder.side == "buy",
            )
            .all()
        )
        unrealized = sum(
            o.quantity * (new_price - o.price)
            for o in pending_buy
            if new_price > o.price
        )
        bot.unrealized_pnl = round(unrealized, 2)

        snapshot = BotSnapshot(
            bot_id=bot.id,
            price=new_price,
            total_assets=round(bot.total_investment + bot.realized_pnl + bot.unrealized_pnl, 2),
            realized_pnl=round(bot.realized_pnl, 2),
            unrealized_pnl=round(bot.unrealized_pnl, 2),
        )
        db.add(snapshot)
        db.commit()

        return {
            "price": new_price,
            "filled_count": len(filled_orders),
            "new_orders_count": len(new_orders),
            "realized_pnl": round(bot.realized_pnl, 2),
            "unrealized_pnl": round(bot.unrealized_pnl, 2),
            "total_trades": bot.total_trades,
        }


grid_engine = GridEngine()
