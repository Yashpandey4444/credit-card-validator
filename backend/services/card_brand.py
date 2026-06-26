def detect_card_brand(card_number: str) -> str:

    if card_number.startswith("4"):
        return "Visa"

    elif card_number.startswith(("51", "52", "53", "54", "55")):
        return "Mastercard"

    elif card_number.startswith(("34", "37")):
        return "American Express"

    else:
        return "Unknown"