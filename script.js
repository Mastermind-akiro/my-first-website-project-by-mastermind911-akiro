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


// ========================================
// ACCOUNT DATA
// ========================================

let balance = 8.35;
let startingBalance = 8.35;

let totalProfit = 0;

let tradeNumber = 0;
let totalTrades = 0;
let winningTrades = 0;
let losingTrades = 0;


// ========================================
// ACCOUNT DISPLAY
// ========================================

const balanceDisplay = document.querySelector(
    ".account-grid div:nth-child(1) strong"
);

const profitDisplay = document.querySelector(
    ".account-grid div:nth-child(2) strong"
);

const winRateDisplay = document.querySelector(
    ".account-grid div:nth-child(3) strong"
);


// ========================================
// UPDATE ACCOUNT DISPLAY
// ========================================

function updateAccountDisplay() {

    balanceDisplay.textContent =
        `$${balance.toFixed(2)}`;


    if (totalProfit >= 0) {

        profitDisplay.textContent =
            `+$${totalProfit.toFixed(2)}`;

    } else {

        profitDisplay.textContent =
            `-$${Math.abs(totalProfit).toFixed(2)}`;
    }


    let winRate = 0;

    if (totalTrades > 0) {

        winRate =
            (winningTrades / totalTrades) * 100;
    }


    winRateDisplay.textContent =
        `${winRate.toFixed(1)}%`;
}


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


contractSelect.addEventListener(
    "change",
    updateContract
);

updateContract();


// ========================================
// SYSTEM MESSAGE
// ========================================

function showTradeMessage(action) {

    const contract =
        contractSelect.value;

    const digit =
        digitInput.value;

    const stake =
        parseFloat(stakeInput.value);


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

    const contract =
        contractSelect.value;

    const digit =
        digitInput.value;

    const stake =
        parseFloat(stakeInput.value);


    const row =
        document.createElement("div");

    row.className =
        "history-row";


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

matchButton.addEventListener(
    "click",
    function () {

        const action =
            matchButton.textContent;

        showTradeMessage(action);

        addTradeToHistory(action);
    }
);


differButton.addEventListener(
    "click",
    function () {

        const action =
            differButton.textContent;

        showTradeMessage(action);

        addTradeToHistory(action);
    }
);


// ========================================
// RESULT SYSTEM
// ========================================

function updateLatestTradeResult(result) {

    const rows =
        tradeHistory.querySelectorAll(
            ".history-row"
        );


    if (rows.length === 0) {

        systemMessage.innerHTML = `

            <p>NO TRADE AVAILABLE</p>

            <p>STATUS: WAITING</p>
        `;

        return;
    }


    const latestRow =
        rows[rows.length - 1];


    const resultCell =
        latestRow.children[5];


    const profitCell =
        latestRow.children[6];


    if (
        resultCell.textContent !==
        "PENDING"
    ) {

        systemMessage.innerHTML = `

            <p>
                TRADE #${tradeNumber}
                ALREADY COMPLETE
            </p>

            <p>
                STATUS:
                ${resultCell.textContent}
            </p>
        `;

        return;
    }


    const stakeText =
        latestRow.children[4].textContent;


    const stake =
        parseFloat(
            stakeText.replace("$", "")
        );


    let profitLoss;


    // ====================================
    // WIN
    // ====================================

    if (result === "WIN") {

        profitLoss = stake;

        balance += stake;

        totalProfit += stake;

        winningTrades++;

    }


    // ====================================
    // LOSS
    // ====================================

    else {

        profitLoss = -stake;

        balance -= stake;

        totalProfit -= stake;

        losingTrades++;
    }


    totalTrades++;


    // ====================================
    // UPDATE HISTORY
    // ====================================

    resultCell.textContent =
        result;


    if (profitLoss >= 0) {

        profitCell.textContent =
            `+$${profitLoss.toFixed(2)}`;

    } else {

        profitCell.textContent =
            `-$${Math.abs(profitLoss).toFixed(2)}`;
    }


    // ====================================
    // UPDATE ACCOUNT
    // ====================================

    updateAccountDisplay();


    // ====================================
    // SYSTEM MESSAGE
    // ====================================

    systemMessage.innerHTML = `

        <p>
            TRADE #${tradeNumber}
        </p>

        <p>
            RESULT: ${result}
        </p>

        <p>
            P/L:
            ${
                profitLoss >= 0
                ? `+$${profitLoss.toFixed(2)}`
                : `-$${Math.abs(profitLoss).toFixed(2)}`
            }
        </p>

        <p>
            BALANCE:
            $${balance.toFixed(2)}
        </p>

        <p>
            STATUS: COMPLETE
        </p>
    `;
}


// ========================================
// MARK WIN
// ========================================

winButton.addEventListener(
    "click",
    function () {

        updateLatestTradeResult("WIN");
    }
);


// ========================================
// MARK LOSS
// ========================================

lossButton.addEventListener(
    "click",
    function () {

        updateLatestTradeResult("LOSS");
    }
);


// ========================================
// INITIAL DISPLAY
// ========================================

updateAccountDisplay();


// ========================================
// SYSTEM ONLINE
// ========================================

console.log(
    "SYSTEM TERMINAL ONLINE"
);
