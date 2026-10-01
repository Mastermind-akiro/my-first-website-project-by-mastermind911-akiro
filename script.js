// ========================================
// SYSTEM TERMINAL
// CONTRACT SYSTEM
// ========================================

const contractSelect = document.getElementById("contract");
const digitInput = document.getElementById("digit");
const stakeInput = document.getElementById("stake");

const matchButton = document.querySelector(".match-btn");
const differButton = document.querySelector(".differ-btn");

const systemMessage = document.getElementById("systemMessage");


// ========================================
// CHANGE CONTRACT
// ========================================

function updateContract() {

    const contract = contractSelect.value;

    if (contract === "Matches / Differs") {

        digitInput.style.display = "block";

        matchButton.textContent = "MATCH";
        differButton.textContent = "DIFFER";
    }

    else if (contract === "Even / Odd") {

        digitInput.style.display = "none";

        matchButton.textContent = "EVEN";
        differButton.textContent = "ODD";
    }

    else if (contract === "Over / Under") {

        digitInput.style.display = "block";

        matchButton.textContent = "OVER";
        differButton.textContent = "UNDER";
    }

    else if (contract === "Rise / Fall") {

        digitInput.style.display = "none";

        matchButton.textContent = "RISE";
        differButton.textContent = "FALL";
    }
}


contractSelect.addEventListener("change", updateContract);

updateContract();


// ========================================
// SYSTEM MESSAGE
// ========================================

function showTradeMessage(action) {

    const contract = contractSelect.value;
    const digit = digitInput.value;
    const stake = stakeInput.value;

    systemMessage.innerHTML = `
        <p>CONTRACT: ${contract}</p>
        <p>PREDICTION: ${action}</p>
        ${digitInput.style.display !== "none"
            ? `<p>DIGIT: ${digit}</p>`
            : ""}
        <p>STAKE: $${stake}</p>
        <p>STATUS: READY</p>
    `;
}


// ========================================
// TRADE BUTTONS
// ========================================

matchButton.addEventListener("click", function () {

    showTradeMessage(matchButton.textContent);

});


differButton.addEventListener("click", function () {

    showTradeMessage(differButton.textContent);

});


console.log("SYSTEM TERMINAL ONLINE");
