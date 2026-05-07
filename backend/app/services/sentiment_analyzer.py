import json

from app.services.ai_service import ai_service


def analyze_reply(email_content: str) -> dict:
    system_prompt = (
        "You are an expert at analyzing business email communications in the context of "
        "international plastic raw materials trade (China to Africa). "
        "Analyze the given email reply and return a JSON object with exactly these fields:\n"
        '- "sentiment": one of "positive", "neutral", "negative"\n'
        '- "intent_score": integer from 1-10 (10 = very likely to buy)\n'
        '- "key_points": array of strings summarizing key points from the email\n'
        '- "follow_up_strategy": string with recommended next steps\n'
        '- "suggested_reply": string with a suggested reply email\n\n'
        "Return ONLY valid JSON, no other text."
    )

    user_prompt = f"Analyze this customer reply email:\n\n{email_content}"

    response = ai_service.generate_text(system_prompt, user_prompt)

    try:
        result = json.loads(response)
    except json.JSONDecodeError:
        result = {
            "sentiment": "neutral",
            "intent_score": 5,
            "key_points": ["Unable to parse AI response"],
            "follow_up_strategy": "Review the email manually and follow up within 24 hours.",
            "suggested_reply": response,
        }

    return result
