from fastapi import FastAPI
from pydantic import BaseModel
from services.luhn import luhn_check
from services.card_brand import detect_card_brand  # Add this import
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This defines what JSON we expect
class CardRequest(BaseModel):
    card_number: str


@app.get("/")
def home():
    return {"message": "Credit Card Validator API is running!"}


@app.post("/validate")
def validate_card(request: CardRequest):

    card_number = request.card_number

    # Basic validation (edge case protection)
    if len(card_number) < 2:
        return {"error": "Card number too short"}

    # Remove spaces and non-digit characters for validation
    clean_number = ''.join(filter(str.isdigit, card_number))
    
    result = luhn_check(clean_number)
    brand = detect_card_brand(clean_number)

    return {
        "card_number": card_number,
        "valid": result,
        "brand": brand  # Add brand to response
    }