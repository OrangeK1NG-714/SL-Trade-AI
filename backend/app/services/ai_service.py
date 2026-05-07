import anthropic

from app.config import settings

MOCK_RESPONSES = {
    "email": (
        "Subject: Premium Plastic Raw Materials - Direct Factory Supply\n\n"
        "Dear {name},\n\n"
        "I hope this message finds you well. I am reaching out from our plastics export division "
        "based in China. We specialize in supplying high-quality PP, PE, and PVC resins to partners "
        "across Africa.\n\n"
        "We offer competitive FOB pricing, flexible MOQ starting from 20 tons, and reliable shipping "
        "to major African ports including Lagos, Mombasa, and Dar es Salaam.\n\n"
        "Would you be open to discussing potential collaboration? I would be happy to share our latest "
        "price list and product specifications.\n\n"
        "Best regards"
    ),
    "sentiment": (
        '{{"sentiment": "positive", "intent_score": 7, '
        '"key_points": ["Interested in PP pricing", "Wants samples first", "Budget around $1200/ton"], '
        '"follow_up_strategy": "Send detailed quotation with sample arrangement. '
        'Emphasize quality certifications and past African market experience.", '
        '"suggested_reply": "Thank you for your interest. I am pleased to arrange samples for you. '
        'Our current PP homopolymer is priced at $1,150/ton FOB Ningbo. '
        'Shall I prepare a formal quotation?"}}'
    ),
    "score": (
        '{{"score": 72, "analysis": "Customer shows strong buying signals: has specific product requirements, '
        "asked about pricing and delivery terms, and has an established import business in Nigeria. "
        "Main risk factor is first-time buyer with no trade history. "
        'Recommend proceeding with sample shipment to build trust.", '
        '"recommendations": ["Send product samples within 1 week", '
        '"Offer competitive trial order pricing for 1 container", '
        '"Provide references from other African buyers"]}}'
    ),
    "trend": (
        "Based on the price data provided, PP prices have shown a moderate upward trend over the past 3 months, "
        "increasing approximately 5-8%. Key factors include rising crude oil prices and strong demand from "
        "African markets. PE prices remain relatively stable. Recommendation: consider locking in current PP "
        "prices for Q2 orders as further increases are likely. PVC prices may soften due to oversupply in the "
        "domestic market."
    ),
    "supplier": (
        '{{"recommended_supplier": "Best Value Plastics Co.", '
        '"reason": "Offers the lowest price per ton at RMB 8,500 with consistent quality ratings of 4.5/5. '
        "Located near Ningbo port which reduces inland freight costs. "
        'MOQ of 25 tons aligns well with typical African order sizes.", '
        '"alternatives": ["Reliable Polymers Ltd - slightly higher price but faster delivery", '
        '"Eastern Resin Factory - best for PVC products"]}}'
    ),
    "notify": (
        "Dear Valued Customer,\n\n"
        "We are writing to update you on the status of your shipment.\n\n"
        "Order Reference: {order_ref}\n"
        "Container: {container_no}\n"
        "Status: {status}\n"
        "Estimated Arrival: {eta}\n\n"
        "Your cargo is currently on schedule. We will continue to monitor the shipment "
        "and notify you of any changes.\n\n"
        "Please do not hesitate to contact us if you have any questions.\n\n"
        "Best regards"
    ),
    "telegram": (
        "Thank you for your interest in our plastic raw materials! "
        "We supply PP, PE, and PVC resins with competitive pricing. "
        "Our MOQ starts from 20 tons, and we ship to all major African ports. "
        "Would you like to receive our latest price list?"
    ),
}


class AIService:
    def __init__(self):
        self.api_key = settings.ANTHROPIC_API_KEY
        self.client = None
        if self.api_key:
            self.client = anthropic.Anthropic(api_key=self.api_key)

    def generate_text(self, system_prompt: str, user_prompt: str) -> str:
        if not self.client:
            return self._mock_response(system_prompt, user_prompt)

        message = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2048,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        return message.content[0].text

    def _mock_response(self, system_prompt: str, user_prompt: str) -> str:
        prompt_lower = (system_prompt + user_prompt).lower()

        if "email" in prompt_lower and ("cold" in prompt_lower or "generat" in prompt_lower):
            return MOCK_RESPONSES["email"]
        if "sentiment" in prompt_lower or "analy" in prompt_lower and "reply" in prompt_lower:
            return MOCK_RESPONSES["sentiment"]
        if "score" in prompt_lower or "probability" in prompt_lower:
            return MOCK_RESPONSES["score"]
        if "trend" in prompt_lower or "price" in prompt_lower and "analysis" in prompt_lower:
            return MOCK_RESPONSES["trend"]
        if "supplier" in prompt_lower or "recommend" in prompt_lower:
            return MOCK_RESPONSES["supplier"]
        if "notify" in prompt_lower or "shipment" in prompt_lower:
            return MOCK_RESPONSES["notify"]
        if "telegram" in prompt_lower or "bot" in prompt_lower:
            return MOCK_RESPONSES["telegram"]

        return (
            "This is a mock AI response. Configure ANTHROPIC_API_KEY in .env "
            "to enable real AI-powered responses."
        )


ai_service = AIService()
