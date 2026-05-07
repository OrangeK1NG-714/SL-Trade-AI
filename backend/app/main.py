from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.api import customers, emails, follow_up, market, pricing, suppliers, logistics, scraper, inquiry, telegram_bot, grid_bot


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="SL Trade Platform API",
    description="AI-powered foreign trade platform for plastic raw materials export to Africa",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customers.router, prefix="/api")
app.include_router(emails.router, prefix="/api")
app.include_router(follow_up.router, prefix="/api")
app.include_router(market.router, prefix="/api")
app.include_router(pricing.router, prefix="/api")
app.include_router(suppliers.router, prefix="/api")
app.include_router(logistics.router, prefix="/api")
app.include_router(scraper.router, prefix="/api")
app.include_router(inquiry.router, prefix="/api")
app.include_router(telegram_bot.router, prefix="/api")
app.include_router(grid_bot.router, prefix="/api")


@app.get("/")
def root():
    return {
        "name": "SL Trade Platform API",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
