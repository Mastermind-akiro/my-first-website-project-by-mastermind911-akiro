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
// PLAYER DATA
// ========================================

let level = 7;

let xp = 2450;
let xpRequired = 3000;

let classScore = 86.4;


// ========================================
// SYSTEM ANALYSIS
// ========================================

let discipline = 91;
let riskControl = 82;
let consistency = 74;


// ========================================
// ACCOUNT DISPLAY
// ========================================

const balanceDisplay =
    document.querySelector(
        ".account-grid div:nth-child(1) strong"
    );

const profitDisplay =
    document.querySelector(
        ".account-grid div:nth-child(2) strong"
    );

const winRateDisplay =
    document.querySelector(
        ".account-grid div:nth-child(3) strong"
    );


// ========================================
// XP DISPLAY
// ========================================

const xpText =
    document.querySelector(".xp span");

const xpBar =
    document.querySelector(".xp-bar div");


// ========================================
// LEVEL DISPLAY
// ========================================

const levelDisplay =
    document.querySelector(
        ".player-info span:nth-child(3)"
    );


// ========================================
// CLASS SCORE DISPLAY
// ========================================

const classScoreDisplay =
    document.querySelector(
        ".current-player strong"
    );


// ========================================
// ANALYSIS DISPLAY
// ========================================

const statBoxes =
    document.querySelectorAll(".stat");

const disciplineDisplay =
    statBoxes[0].querySelector("strong");

const riskControlDisplay =
    statBoxes[1].querySelector("strong");

const consistencyDisplay =
    statBoxes[2].querySelector("strong");

const disciplineBar =
    statBoxes[0].querySelector(".progress div");

const riskControlBar =
    statBoxes[1].querySelector(".progress div");

const consistencyBar =
    statBoxes[2].querySelector(".progress div");


// ========================================
// UPDATE ACCOUNT
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
// UPDATE XP
// ========================================

function updateXPDisplay() {

    xpText.textContent =
        `XP ${xp.toLocaleString()} / ${xpRequired.toLocaleString()}`;


    const percentage =
        (xp / xpRequired) * 100;


    xpBar.style.width =
        `${percentage}%`;
}


// ========================================
// UPDATE LEVEL
// ========================================

function updateLevelDisplay() {

    levelDisplay.textContent =
        `LEVEL: ${String(level).padStart(2, "0")}`;
}


// ========================================
// UPDATE CLASS SCORE
// ========================================

function updateClassScoreDisplay() {

    classScoreDisplay.textContent =
        classScore.toFixed(1);
}


// ========================================
// UPDATE SYSTEM ANALYSIS
// ========================================

function updateAnalysisDisplay() {

    disciplineDisplay.textContent =
        `${discipline.toFixed(0)}%`;

    riskControlDisplay.textContent =
        `${riskControl.toFixed(0)}%`;

    consistencyDisplay.textContent =
        `${consistency.toFixed(0)}%`;


    disciplineBar.style.width =
        `${discipline}%`;

    riskControlBar.style.width =
        `${riskControl}%`;

    consistencyBar.style.width =
        `${consistency}%`;
}


// ========================================
// UPDATE ANALYSIS AFTER TRADE
// ========================================

function updateAnalysis(result, stake) {

    // DISCIPLINE
    // Completing planned trades increases it.

    discipline += 0.3;


    // RISK CONTROL
    // Smaller stakes relative to the balance
    // receive a better system score.

    const riskPercentage =
        (stake / balance) * 100;


    if (riskPercentage <= 10) {

        riskControl += 0.5;

    } else if (riskPercentage <= 20) {

        riskControl += 0.2;

    } else {

        riskControl -= 0.5;
    }


    // CONSISTENCY
    // Based on completed trades.

    if (totalTrades > 0) {

        const completionScore =
            Math.min(
                totalTrades * 2,
                20
            );

        consistency =
            74 + completionScore;
    }


    // Keep values between 0 and 100

    discipline =
        Math.max(
            0,
            Math.min(100, discipline)
        );

    riskControl =
        Math.max(
            0,
            Math.min(100, riskControl)
        );

    consistency =
        Math.max(
            0,
            Math.min(100, consistency)
        );


    updateAnalysisDisplay();
}


// ========================================
// CONTRACT SYSTEM
// ========================================

function updateContract() {

    const contract =
        contractSelect.value;


    if (contract === "Matches / Differs") {

        digitInput.style.display =
            "block";

        matchButton.textContent =
            "MATCH";

        differButton.textContent =
            "DIFFER";
    }


    else if (contract === "Even / Odd") {

        digitInput.style.display =
            "none";

        matchButton.textContent =
            "EVEN";

        differButton.textContent =
            "ODD";
    }


    else if (contract === "Over / Under") {

        digitInput.style.display =
            "block";

        matchButton.textContent =
            "OVER";

        differButton.textContent =
            "UNDER";
    }


    else if (contract === "Rise / Fall") {

        digitInput.style.display =
            "none";

        matchButton.textContent =
            "RISE";

        differButton.textContent =
            "FALL";
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
// WIN XP
// ========================================

function rewardWinXP() {

    xp += 100;

    classScore += 0.5;


    checkLevelUp();

    updateXPDisplay();

    updateLevelDisplay();

    updateClassScoreDisplay();
}


// ========================================
// LOSS XP
// ========================================

function applyLossXP() {

    xp -= 25;

    classScore -= 0.2;


    if (xp < 0) {

        xp = 0;
    }


    if (classScore < 0) {

        classScore = 0;
    }


    updateXPDisplay();

    updateClassScoreDisplay();
}


// ========================================
// LEVEL UP
// ========================================

function checkLevelUp() {

    while (xp >= xpRequired) {

        xp -= xpRequired;

        level++;

        xpRequired += 500;


        systemMessage.innerHTML = `

            <p>◈ SYSTEM LEVEL UP</p>

            <p>NEW LEVEL: ${level}</p>

            <p>XP REQUIREMENT INCREASED</p>
        `;
    }
}


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


        rewardWinXP();
    }


    // ====================================
    // LOSS
    // ====================================

    else {

        profitLoss = -stake;

        balance -= stake;

        totalProfit -= stake;

        losingTrades++;


        applyLossXP();
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
    // UPDATE ANALYSIS
    // ====================================

    updateAnalysis(
        result,
        stake
    );


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
            XP:
            ${xp.toLocaleString()}
            /
            ${xpRequired.toLocaleString()}
        </p>

        <p>
            CLASS SCORE:
            ${classScore.toFixed(1)}
        </p>

        <p>
            DISCIPLINE:
            ${discipline.toFixed(0)}%
        </p>

        <p>
            RISK CONTROL:
            ${riskControl.toFixed(0)}%
        </p>

        <p>
            CONSISTENCY:
            ${consistency.toFixed(0)}%
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

updateXPDisplay();

updateLevelDisplay();

updateClassScoreDisplay();

updateAnalysisDisplay();


// ========================================
// SYSTEM ONLINE
// ========================================

console.log(
    "SYSTEM TERMINAL ONLINE"
);

