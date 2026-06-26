const button = document.getElementById("validate-btn");
const cardInput = document.getElementById("card-number");
const result = document.getElementById("result");
const brandDisplay = document.getElementById("brand-display");

// Format card number as user types (adds spaces)
cardInput.addEventListener("input", function(e) {
    let value = this.value.replace(/\D/g, '');
    
    // Add space every 4 digits
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    this.value = formattedValue;
});

button.addEventListener("click", async function () {

    const cardNumber = cardInput.value;
    if (cardNumber.trim() === "") {
        result.textContent = "Please enter a card number";
        result.style.color = "red";
        brandDisplay.textContent = "";
        brandDisplay.className = "";
        return;
    }

    // Remove spaces before sending
    const cleanNumber = cardNumber.replace(/\s/g, '');

    try {
        const response = await fetch("http://127.0.0.1:8000/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                card_number: cleanNumber
            })
        });

        const data = await response.json();

        // Display validation result first
        if (data.valid) {
            result.textContent = "✅ Valid Card";
            result.className = "success";
            
            // Only show brand for valid cards
            if (data.brand && data.brand !== "Unknown") {
                brandDisplay.textContent = `🏷️ ${data.brand}`;
                brandDisplay.className = "brand-visible";
            } else {
                brandDisplay.textContent = "❓ Unknown Card Type";
                brandDisplay.className = "brand-unknown";
            }
        } else {
            result.textContent = "❌ Invalid Card";
            result.className = "error";
            
            // Clear brand display for invalid cards
            brandDisplay.textContent = "";
            brandDisplay.className = "";
        }
    } catch (error) {
        result.textContent = "⚠️ Error connecting to server";
        result.className = "error";
        brandDisplay.textContent = "";
        brandDisplay.className = "";
        console.error("Error:", error);
    }
});