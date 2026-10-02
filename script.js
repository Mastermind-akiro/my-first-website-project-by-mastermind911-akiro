// ========================================
// SYSTEM TERMINAL
// ========================================


// ========================================
// ELEMENTS
// ========================================

const contractSelect = document.getElementById("contract");
const digitInput = document.getElementById("digit");
const stakeInput = document.getElementById("stake");

const matchButton = document.querySelector(".match-btn");
const differButton = document.querySelector(".differ-btn");

const systemMessage = document.getElementById("systemMessage");
const tradeHistory = document.getElementById("tradeHistory");

const winButton = document.getElementById("winButton");
const lossButton = document.getElementById("lossButton");

let tradeNumber = 0;


// ========================================
// CONTRACT SYSTEM
// ========================================

function updateContract() {

    const contract = contractSelect.value;


    // MATCHES / DIFFERS
    if (contract === "Matches / Differs") {

        digitInput.style.display = "block";

        matchButton.textContent = "MATCH";
        differButton.textContent = "DIFFER";
    }


    // EVEN / ODD
    else if (contract === "Even / Odd") {

        digitInput.style.display = "none";

        matchButton.textContent = "EVEN";
        differButton.textContent = "ODD";
    }


    // OVER / UNDER
    else if (contract === "Over / Under") {

        digitInput.style.display = "block";

        matchButton.textContent = "OVER";
        differButton.textContent = "UNDER";
    }


    // RISE / FALL
    else if (contract === "Rise / Fall") {

        digitInput.style.display = "none";

        matchButton.textContent = "RISE";
        differButton.textContent = "FALL";
    }
}


// Listen for contract changes
contractSelect.addEventListener("change", updateContract);


// Set correct buttons when page loads
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

        ${
            digitInput.style.display !== "none"
            ? `<p>DIGIT: ${digit}</p>`
            : ""
        }

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

        <span>
            ${
                digitInput.style.display !== "none"
                ? digit
                : "—"
            }
        </span>

        <span>$${stake}</span>

        <span>PENDING</span>
    `;

    tradeHistory.appendChild(row);
}


// ========================================
// TRADE BUTTONS
// ========================================


// MATCH / EVEN / OVER / RISE
matchButton.addEventListener("click", function () {

    const action = matchButton.textContent;

    showTradeMessage(action);

    addTradeToHistory(action);
});


// DIFFER / ODD / UNDER / FALL
differButton.addEventListener("click", function () {

    const action = differButton.textContent;

    showTradeMessage(action);

    addTradeToHistory(action);
});


// ========================================
// RESULT SYSTEM
// ========================================

function updateLatestTradeResult(result) {

    const rows = tradeHistory.querySelectorAll(".history-row");


    // No trades yet
    if (rows.length === 0) {

        systemMessage.innerHTML = `
            <p>NO TRADE AVAILABLE</p>
            <p>STATUS: WAITING</p>
        `;

        return;
    }


    // Get newest trade
    const latestRow = rows[rows.length - 1];


    // Result is the sixth column
    const resultCell = latestRow.children[5];


    // Only PENDING trades can be completed
    if (resultCell.textContent !== "PENDING") {

        systemMessage.innerHTML = `
            <p>TRADE #${tradeNumber} ALREADY COMPLETE</p>
            <p>STATUS: ${resultCell.textContent}</p>
        `;

        return;
    }


    // Change PENDING → WIN / LOSS
    resultCell.textContent = result;


    // Update system message
    systemMessage.innerHTML = `
        <p>TRADE #${tradeNumber}</p>
        <p>RESULT: ${result}</p>
        <p>STATUS: COMPLETE</p>
    `;
}


// ========================================
// MARK WIN
// ========================================

winButton.addEventListener("click", function () {

    updateLatestTradeResult("WIN");

});


// ========================================
// MARK LOSS
// ========================================

lossButton.addEventListener("click", function () {

    updateLatestTradeResult("LOSS");

});


// ========================================
// SYSTEM ONLINE
// ========================================

console.log("SYSTEM TERMINAL ONLINE");
