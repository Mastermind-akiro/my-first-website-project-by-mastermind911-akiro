```javascript
// ========================================
// TRADECORE
// STABLE TRADING WORKSPACE SCRIPT
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

const marketSelect = document.getElementById("marketSelect");
const currentPrice = document.getElementById("currentPrice");


// ========================================
// ACCOUNT DATA
// ========================================

let balance = 8.35;
let totalProfit = 0;

let tradeNumber = 0;
let totalTrades = 0;
let winningTrades = 0;
let losingTrades = 0;


// ========================================
// PERFORMANCE DATA
// ========================================

let discipline = 91;
let riskControl = 82;
let consistency = 74;


// ========================================
// MARKET DATA
// ========================================

let tickHistory = [];
let marketRunning = true;

const marketPrices = {
    "Volatility 100 Index": 100000,
    "Volatility 75 Index": 75000,
    "Volatility 50 Index": 50000,
    "Volatility 25 Index": 25000
};


// ========================================
// ACCOUNT DISPLAY
// ========================================

const balanceDisplay =
    document.querySelector(".metric-card:nth-child(1) strong");

const profitDisplay =
    document.querySelector(".metric-card:nth-child(2) strong");

const winRateDisplay =
    document.querySelector(".metric-card:nth-child(3) strong");

const tradesDisplay =
    document.querySelector(".metric-card:nth-child(4) strong");


// ========================================
// UPDATE ACCOUNT
// ========================================

function updateAccountDisplay() {

    if (balanceDisplay) {
        balanceDisplay.textContent =
            "$" + balance.toFixed(2);
    }

    if (profitDisplay) {

        if (totalProfit >= 0) {
            profitDisplay.textContent =
                "+$" + totalProfit.toFixed(2);
        } else {
            profitDisplay.textContent =
                "-$" + Math.abs(totalProfit).toFixed(2);
        }
    }

    if (winRateDisplay) {

        let winRate = 0;

        if (totalTrades > 0) {
            winRate =
                (winningTrades / totalTrades) * 100;
        }

        winRateDisplay.textContent =
            winRate.toFixed(1) + "%";
    }

    if (tradesDisplay) {
        tradesDisplay.textContent =
            totalTrades;
    }
}


// ========================================
// CONTRACT SYSTEM
// ========================================

function updateContract() {

    if (!contractSelect) {
        return;
    }

    const contract =
        contractSelect.value;

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


if (contractSelect) {
    contractSelect.addEventListener(
        "change",
        updateContract
    );
}

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
        <p>STAKE: $${stake.toFixed(2)}</p>
        ${
            digitInput.style.display !== "none"
            ? `<p>DIGIT: ${digit}</p>`
            : ""
        }
        <p>STATUS: PENDING</p>
    `;
}


// ========================================
// ADD TRADE TO HISTORY
// ========================================

function addTradeToHistory(action) {

    tradeNumber++;

    const contract =
        contractSelect.value;

    const digit =
        digitInput.value;

    const stake =
        parseFloat(stakeInput.value);

    if (isNaN(stake) || stake <= 0) {

        systemMessage.innerHTML = `
            <p>INVALID STAKE</p>
            <p>Enter a valid trading amount.</p>
        `;

        return;
    }

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
// EXECUTE TRADE
// ========================================

function executeTrade(action) {

    const stake =
        parseFloat(stakeInput.value);

    if (isNaN(stake) || stake <= 0) {

        systemMessage.innerHTML = `
            <p>TRADE REJECTED</p>
            <p>Invalid stake amount.</p>
        `;

        return;
    }

    if (stake > balance) {

        systemMessage.innerHTML = `
            <p>TRADE REJECTED</p>
            <p>INSUFFICIENT BALANCE</p>
            <p>BALANCE: $${balance.toFixed(2)}</p>
        `;

        return;
    }

    showTradeMessage(action);

    addTradeToHistory(action);
}


if (matchButton) {

    matchButton.addEventListener(
        "click",
        function () {

            executeTrade(
                matchButton.textContent
            );
        }
    );
}


if (differButton) {

    differButton.addEventListener(
        "click",
        function () {

            executeTrade(
                differButton.textContent
            );
        }
    );
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

    if (resultCell.textContent !== "PENDING") {

        systemMessage.innerHTML = `
            <p>TRADE ALREADY COMPLETE</p>
            <p>STATUS: ${resultCell.textContent}</p>
        `;

        return;
    }

    const stakeText =
        latestRow.children[4].textContent;

    const stake =
        parseFloat(
            stakeText.replace("$", "")
        );

    let profitLoss = 0;

    if (result === "WIN") {

        profitLoss = stake;

        balance += stake;
        totalProfit += stake;

        winningTrades++;
    }

    else {

        profitLoss = -stake;

        balance -= stake;
        totalProfit -= stake;

        losingTrades++;
    }

    totalTrades++;

    resultCell.textContent =
        result;

    profitCell.textContent =
        profitLoss >= 0
        ? "+$" + profitLoss.toFixed(2)
        : "-$" + Math.abs(profitLoss).toFixed(2);

    updateAccountDisplay();

    updatePerformance(result, stake);

    systemMessage.innerHTML = `
        <p>TRADE #${tradeNumber}</p>
        <p>RESULT: ${result}</p>
        <p>P/L: ${
            profitLoss >= 0
            ? "+$" + profitLoss.toFixed(2)
            : "-$" + Math.abs(profitLoss).toFixed(2)
        }</p>
        <p>BALANCE: $${balance.toFixed(2)}</p>
        <p>STATUS: COMPLETE</p>
    `;
}


// ========================================
// WIN BUTTON
// ========================================

if (winButton) {

    winButton.addEventListener(
        "click",
        function () {

            updateLatestTradeResult(
                "WIN"
            );
        }
    );
}


// ========================================
// LOSS BUTTON
// ========================================

if (lossButton) {

    lossButton.addEventListener(
        "click",
        function () {

            updateLatestTradeResult(
                "LOSS"
            );
        }
    );
}


// ========================================
// PERFORMANCE SYSTEM
// ========================================

function updatePerformance(
    result,
    stake
) {

    discipline += 0.3;

    const risk =
        (stake / balance) * 100;

    if (risk <= 10) {
        riskControl += 0.5;
    }

    else if (risk <= 20) {
        riskControl += 0.2;
    }

    else {
        riskControl -= 0.5;
    }

    consistency =
        74 + Math.min(
            totalTrades * 2,
            20
        );

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

    updatePerformanceDisplay();
}


// ========================================
// PERFORMANCE DISPLAY
// ========================================

function updatePerformanceDisplay() {

    const stats =
        document.querySelectorAll(
            ".stat"
        );

    if (stats.length < 3) {
        return;
    }

    stats[0].querySelector("strong")
        .textContent =
        Math.round(discipline) + "%";

    stats[0].querySelector(".progress div")
        .style.width =
        discipline + "%";


    stats[1].querySelector("strong")
        .textContent =
        Math.round(riskControl) + "%";

    stats[1].querySelector(".progress div")
        .style.width =
        riskControl + "%";


    stats[2].querySelector("strong")
        .textContent =
        Math.round(consistency) + "%";

    stats[2].querySelector(".progress div")
        .style.width =
        consistency + "%";
}


// ========================================
// MARKET ENGINE
// SIMULATED DATA ONLY
// ========================================

function generateTick() {

    if (!marketRunning) {
        return;
    }

    const marketName =
        marketSelect
        ? marketSelect.value
        : "Volatility 100 Index";

    const basePrice =
        marketPrices[marketName] || 100000;

    const movement =
        (Math.random() - 0.5) * 200;

    const price =
        basePrice + movement;

    const formattedPrice =
        price.toFixed(3);

    if (currentPrice) {

        currentPrice.textContent =
            formattedPrice;
    }

    const digit =
        parseInt(
            formattedPrice
                .replace(".", "")
                .slice(-1)
        );

    tickHistory.push(digit);

    if (tickHistory.length > 100) {
        tickHistory.shift();
    }

    updateMarketAnalysis();
}


// ========================================
// MARKET ANALYSIS
// ========================================

function updateMarketAnalysis() {

    if (tickHistory.length === 0) {
        return;
    }

    const total =
        tickHistory.length;

    let even = 0;
    let odd = 0;

    let over5 = 0;
    let under5 = 0;

    const frequency =
        Array(10).fill(0);

    tickHistory.forEach(
        function (digit) {

            frequency[digit]++;

            if (digit % 2 === 0) {
                even++;
            } else {
                odd++;
            }

            if (digit > 5) {
                over5++;
            } else {
                under5++;
            }
        }
    );


    const mostFrequent =
        frequency.indexOf(
            Math.max(...frequency)
        );


    const analysisCards =
        document.querySelectorAll(
            ".analysis-card"
        );

    if (analysisCards.length < 4) {
        return;
    }


    // DIGIT FREQUENCY

    analysisCards[0]
        .querySelector("strong")
        .textContent =
        mostFrequent;


    analysisCards[0]
        .querySelector("small")
        .textContent =
        frequency[mostFrequent] +
        " occurrences";


    // EVEN / ODD

    const evenPercent =
        (even / total) * 100;

    const oddPercent =
        (odd / total) * 100;


    analysisCards[1]
        .querySelector("strong")
        .textContent =
        evenPercent.toFixed(1) +
        "% EVEN";


    analysisCards[1]
        .querySelector("small")
        .textContent =
        oddPercent.toFixed(1) +
        "% ODD";


    // OVER / UNDER

    const overPercent =
        (over5 / total) * 100;

    const underPercent =
        (under5 / total) * 100;


    analysisCards[2]
        .querySelector("strong")
        .textContent =
        overPercent.toFixed(1) +
        "% OVER";


    analysisCards[2]
        .querySelector("small")
        .textContent =
        underPercent.toFixed(1) +
        "% UNDER";


    // MATCH / DIFFER

    analysisCards[3]
        .querySelector("strong")
        .textContent =
        frequency[mostFrequent] +
        "/" +
        total;


    analysisCards[3]
        .querySelector("small")
        .textContent =
        "Latest digit: " +
        tickHistory[tickHistory.length - 1];
}


// ========================================
// MARKET SELECTOR
// ========================================

if (marketSelect) {

    marketSelect.addEventListener(
        "change",
        function () {

            const marketName =
                marketSelect.value;

            const volatility =
                marketName
                    .replace(" Index", "")
                    .toUpperCase();

            const volatilityDisplay =
                document.querySelector(
                    ".market-volatility"
                );

            if (volatilityDisplay) {

                volatilityDisplay.textContent =
                    volatility;
            }

            tickHistory = [];

            if (currentPrice) {

                currentPrice.textContent =
                    "0.000";
            }

            systemMessage.innerHTML = `
                <p>MARKET SELECTED</p>
                <p>${marketName}</p>
                <p>STATUS: SIMULATION RUNNING</p>
            `;
        }
    );
}


// ========================================
// START MARKET ENGINE
// ========================================

setInterval(
    generateTick,
    1200
);


// ========================================
// INITIALIZE
// ========================================

updateAccountDisplay();

updatePerformanceDisplay();

console.log(
    "TRADECORE SYSTEM ONLINE"
);

console.log(
    "MARKET ENGINE: SIMULATED"
);
```


