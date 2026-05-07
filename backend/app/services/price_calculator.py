MOCK_EXCHANGE_RATES = {
    "usd_rmb": 7.24,
    "eur_rmb": 7.85,
    "usd_eur": 0.92,
}


def get_exchange_rate() -> dict:
    return {
        "usd_rmb": MOCK_EXCHANGE_RATES["usd_rmb"],
        "eur_rmb": MOCK_EXCHANGE_RATES["eur_rmb"],
        "usd_eur": MOCK_EXCHANGE_RATES["usd_eur"],
        "source": "mock",
        "note": "Configure real exchange rate API for production use",
    }


def calculate_fob(
    product_price_rmb: float,
    quantity_tons: float,
    inland_freight: float = 0,
    customs_fee: float = 0,
    port_charges: float = 0,
) -> dict:
    rate = MOCK_EXCHANGE_RATES["usd_rmb"]
    total_product_rmb = product_price_rmb * quantity_tons
    total_cost_rmb = total_product_rmb + inland_freight + customs_fee + port_charges
    total_cost_usd = total_cost_rmb / rate
    fob_per_ton_usd = total_cost_usd / quantity_tons if quantity_tons > 0 else 0

    return {
        "product_price_rmb": product_price_rmb,
        "quantity_tons": quantity_tons,
        "total_product_rmb": round(total_product_rmb, 2),
        "inland_freight": inland_freight,
        "customs_fee": customs_fee,
        "port_charges": port_charges,
        "total_cost_rmb": round(total_cost_rmb, 2),
        "exchange_rate": rate,
        "total_cost_usd": round(total_cost_usd, 2),
        "fob_per_ton_usd": round(fob_per_ton_usd, 2),
    }


def calculate_cif(
    fob_usd: float,
    ocean_freight: float = 0,
    insurance: float = 0,
) -> dict:
    cif_usd = fob_usd + ocean_freight + insurance

    return {
        "fob_usd": fob_usd,
        "ocean_freight": ocean_freight,
        "insurance": insurance,
        "cif_usd": round(cif_usd, 2),
    }


def calculate_profit(
    cif_usd: float,
    target_margin: float,
) -> dict:
    margin_multiplier = 1 + (target_margin / 100)
    final_price = cif_usd * margin_multiplier
    profit = final_price - cif_usd

    return {
        "cif_usd": cif_usd,
        "target_margin_percent": target_margin,
        "final_price_usd": round(final_price, 2),
        "profit_usd": round(profit, 2),
    }
