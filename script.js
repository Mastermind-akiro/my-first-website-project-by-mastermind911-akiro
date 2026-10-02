// ========================================
// SYSTEM TERMINAL
// ========================================

// ELEMENTS
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
    const stake = parseFloat(stakeInput.value);

    systemMessage.innerHTML = `

        <p>CONTRACT: ${contract}</p>

        <p>PREDICTION: ${action}</p>

        ${
            digitInput.style.display !== "none"
            ? `<p>DIGIT: ${digit}</p>`
            : ""
        }

        <p>STAKE: $${stake.toFixed(2)}</p>

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
    const stake = parseFloat(stakeInput.value);

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

        <span>$${stake.toFixed(2)}</span>

        <span>PENDING</span>

        <span>—</span>
    `;

    tradeHistory.appendChild(row);
}


// ========================================
// TRADE BUTTONS
// ========================================

matchButton.addEventListener("click", function () {

    const action = matchButton.textContent;

    showTradeMessage(action);

    addTradeToHistory(action);
});


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

    // No trade exists
    if (rows.length === 0) {

        systemMessage.innerHTML = `

            <p>NO TRADE AVAILABLE</p>

            <p>STATUS: WAITING</p>
        `;

        return;
    }


    // Get latest trade
    const latestRow = rows[rows.length - 1];


    // Column positions
    const resultCell = latestRow.children[5];
    const profitCell = latestRow.children[6];


    // Prevent completing the same trade twice
    if (resultCell.textContent !== "PENDING") {

        systemMessage.innerHTML = `

            <p>TRADE #${tradeNumber} ALREADY COMPLETE</p>

            <p>STATUS: ${resultCell.textContent}</p>
        `;

        return;
    }


    // Get stake
    const stakeText = latestRow.children[4].textContent;

    const stake = parseFloat(
        stakeText.replace("$", "")
    );


    // Calculate profit/loss
    let profitLoss;


    if (result === "WIN") {

        profitLoss = stake;

    } else {

        profitLoss = -stake;
    }


    // Update result
    resultCell.textContent = result;


    // Update P/L
    if (profitLoss >= 0) {

        profitCell.textContent =
            `+$${profitLoss.toFixed(2)}`;

    } else {

        profitCell.textContent =
            `-$${Math.abs(profitLoss).toFixed(2)}`;
    }


    // Update system message
    systemMessage.innerHTML = `

        <p>TRADE #${tradeNumber}</p>

        <p>RESULT: ${result}</p>

        <p>P/L:
            ${
                profitLoss >= 0
                ? `+$${profitLoss.toFixed(2)}`
                : `-$${Math.abs(profitLoss).toFixed(2)}`
            }
        </p>

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
