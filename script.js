```javascript
// ========================================
// SYSTEM TERMINAL
// Jinwoo × Class Ranking
// ========================================


// CONTRACT SYSTEM
const contractSelect = document.getElementById("contract");
const digitInput = document.getElementById("digit");
const matchButton = document.querySelector(".match-btn");
const differButton = document.querySelector(".differ-btn");


// Change the trading controls
function updateContract() {

    const contract = contractSelect.value;

    // Matches / Differs
    if (contract === "Matches / Differs") {

        digitInput.style.display = "block";

        matchButton.textContent = "MATCH";
        differButton.textContent = "DIFFER";

        matchButton.style.display = "block";
        differButton.style.display = "block";
    }


    // Even / Odd
    else if (contract === "Even / Odd") {

        digitInput.style.display = "none";

        matchButton.textContent = "EVEN";
        differButton.textContent = "ODD";

        matchButton.style.display = "block";
        differButton.style.display = "block";
    }


    // Over / Under
    else if (contract === "Over / Under") {

        digitInput.style.display = "block";

        matchButton.textContent = "OVER";
        differButton.textContent = "UNDER";

        matchButton.style.display = "block";
        differButton.style.display = "block";
    }


    // Rise / Fall
    else if (contract === "Rise / Fall") {

        digitInput.style.display = "none";

        matchButton.textContent = "RISE";
        differButton.textContent = "FALL";

        matchButton.style.display = "block";
        differButton.style.display = "block";
    }
}


// Listen for contract changes
contractSelect.addEventListener("change", updateContract);


// Run once when the page loads
updateContract();


// ========================================
// SYSTEM MESSAGE
// ========================================

function showSystemMessage(message) {

    console.log("SYSTEM:", message);

}


// ========================================
// TRADE BUTTONS
// ========================================

matchButton.addEventListener("click", function () {

    const contract = contractSelect.value;

    showSystemMessage(
        contract + " → " + matchButton.textContent
    );

});


differButton.addEventListener("click", function () {

    const contract = contractSelect.value;

    showSystemMessage(
        contract + " → " + differButton.textContent
    );

});


// ========================================
// SYSTEM START
// ========================================

console.log("SYSTEM TERMINAL ONLINE");
```
