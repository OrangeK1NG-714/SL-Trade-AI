from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ai_service import ai_service

router = APIRouter(prefix="/telegram", tags=["telegram"])

telegram_config_store: dict = {
    "token": "",
    "welcome_message": "Welcome! I am the SL Trade assistant bot. How can I help you today?",
    "product_info": "We supply PP, PE, PVC plastic raw materials from China to Africa.",
    "faq": [
        {"question": "What products do you offer?", "answer": "We supply PP, PE, PVC, and other plastic resins."},
        {"question": "What is your MOQ?", "answer": "Our minimum order quantity starts from 20 tons (1 container)."},
        {"question": "Which countries do you ship to?", "answer": "We ship to all African countries with major ports."},
    ],
}

MOCK_CONVERSATIONS = [
    {
        "id": 1,
        "chat_id": "123456789",
        "username": "buyer_ghana",
        "display_name": "Ibrahim from Ghana",
        "messages": [
            {"role": "user", "content": "Hello, I need PP homopolymer pricing", "timestamp": "2026-05-01T10:00:00Z"},
            {"role": "bot", "content": "Welcome! Our PP homopolymer is currently priced at $1,100-1,200/ton FOB. What quantity are you looking for?", "timestamp": "2026-05-01T10:00:05Z"},
            {"role": "user", "content": "About 50 tons to Tema port", "timestamp": "2026-05-01T10:01:00Z"},
        ],
        "last_active": "2026-05-01T10:01:00Z",
        "status": "active",
    },
    {
        "id": 2,
        "chat_id": "987654321",
        "username": "nigeria_imports",
        "display_name": "Chukwuma Lagos",
        "messages": [
            {"role": "user", "content": "Do you have HDPE blow molding grade?", "timestamp": "2026-04-30T14:00:00Z"},
            {"role": "bot", "content": "Yes, we have HDPE blow molding grade available. Would you like a quotation?", "timestamp": "2026-04-30T14:00:05Z"},
        ],
        "last_active": "2026-04-30T14:00:05Z",
        "status": "active",
    },
]


class TelegramConfigUpdate(BaseModel):
    token: Optional[str] = None
    welcome_message: Optional[str] = None
    product_info: Optional[str] = None
    faq: Optional[list[dict]] = None


class TestReplyRequest(BaseModel):
    user_message: str
    context: str = ""


@router.post("/config")
def save_telegram_config(data: TelegramConfigUpdate):
    if data.token is not None:
        telegram_config_store["token"] = data.token
    if data.welcome_message is not None:
        telegram_config_store["welcome_message"] = data.welcome_message
    if data.product_info is not None:
        telegram_config_store["product_info"] = data.product_info
    if data.faq is not None:
        telegram_config_store["faq"] = data.faq

    return {"detail": "Config updated", "config": telegram_config_store}


@router.get("/config")
def get_telegram_config():
    return telegram_config_store


@router.get("/conversations")
def list_conversations():
    return {
        "total": len(MOCK_CONVERSATIONS),
        "conversations": MOCK_CONVERSATIONS,
        "source": "mock",
    }


@router.post("/test-reply")
def test_ai_reply(data: TestReplyRequest):
    faq_text = "\n".join(
        [f"Q: {item['question']}\nA: {item['answer']}" for item in telegram_config_store.get("faq", [])]
    )

    system_prompt = (
        "You are a helpful Telegram bot assistant for a plastic raw materials export company "
        "(China to Africa). Answer customer inquiries concisely and helpfully.\n\n"
        f"Product info: {telegram_config_store.get('product_info', '')}\n\n"
        f"FAQ:\n{faq_text}\n\n"
        "Keep responses short and suitable for Telegram chat format."
    )

    user_prompt = data.user_message
    if data.context:
        user_prompt = f"Previous context: {data.context}\n\nCustomer message: {data.user_message}"

    reply = ai_service.generate_text(system_prompt, user_prompt)

    return {
        "user_message": data.user_message,
        "bot_reply": reply,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
