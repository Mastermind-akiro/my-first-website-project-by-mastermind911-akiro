```javascript
// ========================================
// TRADECORE
// CLEAN STABLE SCRIPT
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

const marketSelect = document.getElementById("marketSelect");
const currentPrice = document.getElementById("currentPrice");


// ========================================
// ACCOUNT
// ========================================

let balance = 8.35;
let totalProfit = 0;

let tradeNumber = 0;
let totalTrades = 0;
let winningTrades = 0;
let losingTrades = 0;


// ========================================
// PERFORMANCE
// ========================================

let discipline = 91;
let riskControl = 82;
let consistency = 74;


// ========================================
// MARKET
// ========================================

let tickHistory = [];

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
// CONTRACT
// ========================================

function updateContract() {

    const contract =
        contractSelect.value;

    if (contract === "Matches / Differs") {

        digitInput.style.display = "block";

        matchButton.textContent = "MATCH";
        differButton.textContent = "DIFFER";
    }

    if (contract === "Even / Odd") {

        digitInput.style.display = "none";

        matchButton.textContent = "EVEN";
        differButton.textContent = "ODD";
    }

    if (contract === "Over / Under") {

        digitInput.style.display = "block";

        matchButton.textContent = "OVER";
        differButton.textContent = "UNDER";
    }

    if (contract === "Rise / Fall") {

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

    const stake =
        parseFloat(stakeInput.value);

    systemMessage.innerHTML = "";

    const line1 =
        document.createElement("p");

    line1.textContent =
        "CONTRACT: " + contract;

    systemMessage.appendChild(line1);


    const line2 =
        document.createElement("p");

    line2.textContent =
        "PREDICTION: " + action;

    systemMessage.appendChild(line2);


    const line3 =
        document.createElement("p");

    line3.textContent =
        "STAKE: $" + stake.toFixed(2);

    systemMessage.appendChild(line3);


    if (digitInput.style.display !== "none") {

        const digitLine =
            document.createElement("p");

        digitLine.textContent =
            "DIGIT: " + digitInput.value;

        systemMessage.appendChild(
            digitLine
        );
    }


    const statusLine =
        document.createElement("p");

    statusLine.textContent =
        "STATUS: PENDING";

    systemMessage.appendChild(
        statusLine
    );
}


// ========================================
// ADD TRADE
// ========================================

function addTradeToHistory(action) {

    const stake =
        parseFloat(stakeInput.value);

    if (isNaN(stake) || stake <= 0) {

        systemMessage.textContent =
            "INVALID STAKE";

        return false;
    }

    if (stake > balance) {

        systemMessage.textContent =
            "INSUFFICIENT BALANCE";

        return false;
    }


    tradeNumber++;


    const row =
        document.createElement("div");

    row.className =
        "history-row";


    const numberCell =
        document.createElement("span");

    numberCell.textContent =
        tradeNumber;


    const contractCell =
        document.createElement("span");

    contractCell.textContent =
        contractSelect.value;


    const actionCell =
        document.createElement("span");

    actionCell.textContent =
        action;


    const digitCell =
        document.createElement("span");

    if (digitInput.style.display !== "none") {
        digitCell.textContent =
            digitInput.value;
    } else {
        digitCell.textContent =
            "—";
    }


    const stakeCell =
        document.createElement("span");

    stakeCell.textContent =
        "$" + stake.toFixed(2);


    const resultCell =
        document.createElement("span");

    resultCell.textContent =
        "PENDING";


    const profitCell =
        document.createElement("span");

    profitCell.textContent =
        "—";


    row.appendChild(numberCell);
    row.appendChild(contractCell);
    row.appendChild(actionCell);
    row.appendChild(digitCell);
    row.appendChild(stakeCell);
    row.appendChild(resultCell);
    row.appendChild(profitCell);


    tradeHistory.appendChild(row);

    return true;
}


// ========================================
// EXECUTE TRADE
// ========================================

function executeTrade(action) {

    const stake =
        parseFloat(stakeInput.value);


    if (isNaN(stake) || stake <= 0) {

        systemMessage.textContent =
            "TRADE REJECTED: INVALID STAKE";

        return;
    }


    if (stake > balance) {

        systemMessage.textContent =
            "TRADE REJECTED: INSUFFICIENT BALANCE";

        return;
    }


    const added =
        addTradeToHistory(action);


    if (added === false) {
        return;
    }


    showTradeMessage(action);
}


matchButton.addEventListener(
    "click",
    function () {

        executeTrade(
            matchButton.textContent
        );
    }
);


differButton.addEventListener(
    "click",
    function () {

        executeTrade(
            differButton.textContent
        );
    }
);


// ========================================
// RESULT
// ========================================

function updateLatestTradeResult(result) {

    const rows =
        tradeHistory.querySelectorAll(
            ".history-row"
        );


    if (rows.length === 0) {

        systemMessage.textContent =
            "NO TRADE AVAILABLE";

        return;
    }


    const latestRow =
        rows[rows.length - 1];


    const resultCell =
        latestRow.children[5];

    const profitCell =
        latestRow.children[6];


    if (resultCell.textContent !== "PENDING") {

        systemMessage.textContent =
            "LATEST TRADE ALREADY COMPLETE";

        return;
    }


    const stake =
        parseFloat(
            latestRow.children[4]
                .textContent
                .replace("$", "")
        );


    let profitLoss = 0;


    if (result === "WIN") {

        profitLoss =
            stake;

        balance += stake;
        totalProfit += stake;

        winningTrades++;
    }


    if (result === "LOSS") {

        profitLoss =
            -stake;

        balance -= stake;
        totalProfit -= stake;

        losingTrades++;
    }


    totalTrades++;


    resultCell.textContent =
        result;


    if (profitLoss >= 0) {

        profitCell.textContent =
            "+$" + profitLoss.toFixed(2);

    } else {

        profitCell.textContent =
            "-$" + Math.abs(profitLoss).toFixed(2);
    }


    updateAccountDisplay();

    updatePerformance(result, stake);


    systemMessage.innerHTML = "";

    const resultLine =
        document.createElement("p");

    resultLine.textContent =
        "TRADE #" + tradeNumber;

    systemMessage.appendChild(
        resultLine
    );


    const statusLine =
        document.createElement("p");

    statusLine.textContent =
        "RESULT: " + result;

    systemMessage.appendChild(
        statusLine
    );


    const profitLine =
        document.createElement("p");

    if (profitLoss >= 0) {

        profitLine.textContent =
            "P/L: +$" +
            profitLoss.toFixed(2);

    } else {

        profitLine.textContent =
            "P/L: -$" +
            Math.abs(profitLoss).toFixed(2);
    }

    systemMessage.appendChild(
        profitLine
    );


    const balanceLine =
        document.createElement("p");

    balanceLine.textContent =
        "BALANCE: $" +
        balance.toFixed(2);

    systemMessage.appendChild(
        balanceLine
    );


    const completeLine =
        document.createElement("p");

    completeLine.textContent =
        "STATUS: COMPLETE";

    systemMessage.appendChild(
        completeLine
    );
}


// ========================================
// WIN / LOSS BUTTONS
// ========================================

winButton.addEventListener(
    "click",
    function () {

        updateLatestTradeResult(
            "WIN"
        );
    }
);


lossButton.addEventListener(
    "click",
    function () {

        updateLatestTradeResult(
            "LOSS"
        );
    }
);


// ========================================
// PERFORMANCE
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

    } else if (risk <= 20) {

        riskControl += 0.2;

    } else {

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
            Math.min(
                100,
                discipline
            )
        );


    riskControl =
        Math.max(
            0,
            Math.min(
                100,
                riskControl
            )
        );


    consistency =
        Math.max(
            0,
            Math.min(
                100,
                consistency
            )
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


    stats[0]
        .querySelector("strong")
        .textContent =
        Math.round(discipline) + "%";


    stats[0]
        .querySelector(".progress div")
        .style.width =
        discipline + "%";


    stats[1]
        .querySelector("strong")
        .textContent =
        Math.round(riskControl) + "%";


    stats[1]
        .querySelector(".progress div")
        .style.width =
        riskControl + "%";


    stats[2]
        .querySelector("strong")
        .textContent =
        Math.round(consistency) + "%";


    stats[2]
        .querySelector(".progress div")
        .style.width =
        consistency + "%";
}


// ========================================
// MARKET ENGINE
// SIMULATED DATA
// ========================================

function generateTick() {

    if (!marketSelect) {
        return;
    }


    const market =
        marketSelect.value;


    let basePrice =
        marketPrices[market];


    if (!basePrice) {
        basePrice = 100000;
    }


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


    const digits =
        formattedPrice
            .replace(".", "");


    const lastDigit =
        parseInt(
            digits.charAt(
                digits.length - 1
            )
        );


    tickHistory.push(
        lastDigit
    );


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


    let even = 0;
    let odd = 0;

    let over = 0;
    let under = 0;

    const frequency =
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


    for (
        let i = 0;
        i < tickHistory.length;
        i++
    ) {

        const digit =
            tickHistory[i];


        frequency[digit]++;


        if (digit % 2 === 0) {
            even++;
        } else {
            odd++;
        }


        if (digit > 5) {
            over++;
        } else {
            under++;
        }
    }


    let mostFrequent =
        0;


    for (
        let i = 1;
        i < 10;
        i++
    ) {

        if (
            frequency[i] >
            frequency[mostFrequent]
        ) {

            mostFrequent =
                i;
        }
    }


    const total =
        tickHistory.length;


    const cards =
        document.querySelectorAll(
            ".analysis-card"
        );


    if (cards.length < 4) {
        return;
    }


    const evenPercent =
        (even / total) * 100;


    const oddPercent =
        (odd / total) * 100;


    const overPercent =
        (over / total) * 100;


    const underPercent =
        (under / total) * 100;


    cards[0]
        .querySelector("strong")
        .textContent =
        mostFrequent;


    cards[0]
        .querySelector("small")
        .textContent =
        frequency[mostFrequent] +
        " occurrences";


    cards[1]
        .querySelector("strong")
        .textContent =
        evenPercent.toFixed(1) +
        "% EVEN";


    cards[1]
        .querySelector("small")
        .textContent =
        oddPercent.toFixed(1) +
        "% ODD";


    cards[2]
        .querySelector("strong")
        .textContent =
        overPercent.toFixed(1) +
        "% OVER";


    cards[2]
        .querySelector("small")
        .textContent =
        underPercent.toFixed(1) +
        "% UNDER";


    cards[3]
        .querySelector("strong")
        .textContent =
        frequency[mostFrequent] +
        "/" +
        total;


    cards[3]
        .querySelector("small")
        .textContent =
        "Latest digit: " +
        tickHistory[
            tickHistory.length - 1
        ];
}


// ========================================
// MARKET SELECTOR
// ========================================

if (marketSelect) {

    marketSelect.addEventListener(
        "change",
        function () {

            const market =
                marketSelect.value;


            const volatility =
                market
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


            systemMessage.innerHTML = "";


            const marketLine =
                document.createElement("p");

            marketLine.textContent =
                "MARKET SELECTED: " +
                market;

            systemMessage.appendChild(
                marketLine
            );


            const statusLine =
                document.createElement("p");

            statusLine.textContent =
                "STATUS: SIMULATION RUNNING";

            systemMessage.appendChild(
                statusLine
            );
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



