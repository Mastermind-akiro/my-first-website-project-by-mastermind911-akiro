// ========================================
// SYSTEM TERMINAL
// ========================================

// CONTRACT CONTROLS
const contractSelect = document.getElementById("contract");
const digitInput = document.getElementById("digit");
const stakeInput = document.getElementById("stake");

const matchButton = document.querySelector(".match-btn");
const differButton = document.querySelector(".differ-btn");

// SYSTEM MESSAGE
const systemMessage = document.getElementById("systemMessage");

// TRADE HISTORY
const tradeHistory = document.getElementById("tradeHistory");
const winButton = document.getElementById("winButton");
const lossButton = document.getElementById("lossButton");

let tradeNumber = 0;


// ========================================
// CONTRACT SYSTEM
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


// Listen for contract changes
contractSelect.addEventListener("change", updateContract);

// Set correct buttons when page opens
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
        <p>STATUS: PENDING</p>
    `;
}


// ========================================
// TRADE HISTORY
// ========================================

function addTradeToHistory(action) {

    tradeNumber++;

    const contract = contractSelect.value;
    const digit = digitInput.value;
    const stake = stakeInput.value;

    const row = document.createElement("div");

    row.className = "history-row";

    row.innerHTML = `
        <span>${tradeNumber}</span>
        <span>${contract}</span>
        <span>${action}</span>
        <span>${digitInput.style.display !== "none" ? digit : "—"}</span>
        <span>$${stake}</span>
        <span>PENDING</span>
    `;

    tradeHistory.appendChild(row);
}


// ========================================
// MATCH / EVEN / OVER / RISE BUTTON
// ========================================

matchButton.addEventListener("click", function () {

    const action = matchButton.textContent;

    showTradeMessage(action);

    addTradeToHistory(action);
});


// ========================================
// DIFFER / ODD / UNDER / FALL BUTTON
// ========================================

differButton.addEventListener("click", function () {

    const action = differButton.textContent;

    showTradeMessage(action);

    addTradeToHistory(action);
});


// ========================================
// SYSTEM START
// ========================================

console.log("SYSTEM TERMINAL ONLINE");
