from fastapi import APIRouter
from pydantic import BaseModel

from app.services.sentiment_analyzer import analyze_reply
from app.services.ai_service import ai_service

router = APIRouter(prefix="/follow-up", tags=["follow-up"])


class AnalyzeRequest(BaseModel):
    email_content: str
    customer_name: str = ""
    customer_country: str = ""


class GenerateReplyRequest(BaseModel):
    original_email: str
    customer_name: str = ""
    customer_country: str = ""
    language: str = "en"
    context: str = ""


@router.post("/analyze")
def analyze_customer_reply(data: AnalyzeRequest):
    result = analyze_reply(data.email_content)
    return {
        "customer_name": data.customer_name,
        "customer_country": data.customer_country,
        **result,
    }


@router.post("/generate-reply")
def generate_follow_up_reply(data: GenerateReplyRequest):
    language_map = {
        "en": "English",
        "fr": "French",
        "pt": "Portuguese",
    }
    language_name = language_map.get(data.language, "English")

    system_prompt = (
        "You are an expert international trade email writer for a Chinese company "
        "exporting plastic raw materials (PP, PE, PVC) to Africa. "
        f"Write a follow-up reply email in {language_name}. "
        "The reply should be professional, address the customer's points, "
        "and move the conversation toward closing a deal. "
        "Return ONLY the email body, no subject line."
    )

    user_prompt = (
        f"Write a reply to this customer email:\n\n"
        f"Customer: {data.customer_name}\n"
        f"Country: {data.customer_country}\n"
        f"Additional context: {data.context}\n\n"
        f"Customer's email:\n{data.original_email}"
    )

    reply = ai_service.generate_text(system_prompt, user_prompt)

    return {
        "reply": reply,
        "language": data.language,
        "customer_name": data.customer_name,
    }
