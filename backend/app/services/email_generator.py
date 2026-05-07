from app.services.ai_service import ai_service


LANGUAGE_INSTRUCTIONS = {
    "en": "Write the email in English.",
    "fr": "Write the email in French (Francais).",
    "pt": "Write the email in Portuguese (Portugues).",
}

TONE_INSTRUCTIONS = {
    "professional": "Use a professional and formal tone.",
    "friendly": "Use a warm, friendly, and approachable tone.",
    "urgent": "Use an urgent tone that conveys time-sensitivity and scarcity.",
}


def generate_cold_email(
    customer_info: dict,
    language: str,
    product: str,
    tone: str,
) -> dict:
    system_prompt = (
        "You are an expert international trade email copywriter specializing in "
        "plastic raw materials (PP, PE, PVC) export from China to Africa. "
        "Generate a cold outreach email that is culturally appropriate and effective. "
        "Return ONLY the email with the first line being 'Subject: ...' followed by a blank line "
        "and then the email body. Do not include any other text or explanation."
    )

    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["en"])
    tone_instruction = TONE_INSTRUCTIONS.get(tone, TONE_INSTRUCTIONS["professional"])

    user_prompt = (
        f"Generate a cold email for a potential buyer.\n\n"
        f"Customer info:\n"
        f"- Name: {customer_info.get('name', 'Sir/Madam')}\n"
        f"- Company: {customer_info.get('company', 'N/A')}\n"
        f"- Country: {customer_info.get('country', 'Africa')}\n\n"
        f"Product: {product}\n\n"
        f"{lang_instruction}\n"
        f"{tone_instruction}\n\n"
        f"The email should highlight: competitive pricing, quality assurance, "
        f"flexible MOQ, reliable shipping to African ports, and established export experience."
    )

    response = ai_service.generate_text(system_prompt, user_prompt)

    subject = ""
    body = response

    lines = response.strip().split("\n")
    for i, line in enumerate(lines):
        if line.lower().startswith("subject:"):
            subject = line[len("subject:"):].strip()
            body = "\n".join(lines[i + 1:]).strip()
            break

    return {"subject": subject, "body": body}
