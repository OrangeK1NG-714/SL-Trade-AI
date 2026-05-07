import asyncio
import logging

from app.database import SessionLocal
from app.models.grid_bot import GridBot
from app.services.grid_engine import grid_engine

logger = logging.getLogger(__name__)


class BotRunner:
    def __init__(self):
        self._tasks: dict[int, asyncio.Task] = {}

    def is_running(self, bot_id: int) -> bool:
        task = self._tasks.get(bot_id)
        return task is not None and not task.done()

    async def start(self, bot_id: int, interval: float = 5.0):
        if self.is_running(bot_id):
            return

        task = asyncio.create_task(self._run_loop(bot_id, interval))
        self._tasks[bot_id] = task

    async def stop(self, bot_id: int):
        task = self._tasks.pop(bot_id, None)
        if task and not task.done():
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass

    async def _run_loop(self, bot_id: int, interval: float):
        try:
            while True:
                db = SessionLocal()
                try:
                    bot = db.query(GridBot).filter(GridBot.id == bot_id).first()
                    if not bot or bot.status != "running":
                        break
                    grid_engine.tick(bot, db)
                finally:
                    db.close()
                await asyncio.sleep(interval)
        except asyncio.CancelledError:
            logger.info(f"Bot {bot_id} stopped")
        except Exception:
            logger.exception(f"Bot {bot_id} error")


bot_runner = BotRunner()
