```javascript
// ============================================================
// TRADECORE — PROFESSIONAL TRADING WORKSPACE
// MARKET INTELLIGENCE + TRADING ENGINE
// ============================================================


// ============================================================
// ELEMENTS
// ============================================================

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

const currentPriceDisplay =
    document.getElementById("currentPrice");


// ============================================================
// ACCOUNT DATA
// ============================================================

let balance = 8.35;
let startingBalance = 8.35;

let totalProfit = 0;

let tradeNumber = 0;
let totalTrades = 0;
let winningTrades = 0;
let losingTrades = 0;


// ============================================================
// PERFORMANCE DATA
// ============================================================

let level = 7;

let xp = 2450;
let xpRequired = 3000;

let classScore = 86.4;

let discipline = 91;
let riskControl = 82;
let consistency = 74;


// ============================================================
// MARKET DATA
// ============================================================

let currentPrice = 12345.6789;

let previousPrice = currentPrice;

let currentDigit = 0;

let tickHistory = [];

const MAX_TICKS = 20;


// ============================================================
// ACCOUNT DISPLAY
// ============================================================

const balanceDisplay =
    document.querySelector(
        ".account-grid .metric-card:nth-child(1) strong"
    );

const profitDisplay =
    document.querySelector(
        ".account-grid .metric-card:nth-child(2) strong"
    );

const winRateDisplay =
    document.querySelector(
        ".account-grid .metric-card:nth-child(3) strong"
    );

const tradesDisplay =
    document.querySelector(
        ".account-grid .metric-card:nth-child(4) strong"
    );


// ============================================================
// PERFORMANCE DISPLAY
// ============================================================

const statElements =
    document.querySelectorAll(".stat");


// ============================================================
// ACCOUNT UPDATE
// ============================================================

function updateAccountDisplay() {

    if (balanceDisplay) {
        balanceDisplay.textContent =
            `$${balance.toFixed(2)}`;
    }


    if (profitDisplay) {

        if (totalProfit >= 0) {

            profitDisplay.textContent =
                `+$${totalProfit.toFixed(2)}`;

        } else {

            profitDisplay.textContent =
                `-$${Math.abs(totalProfit).toFixed(2)}`;
        }
    }


    if (winRateDisplay) {

        let winRate = 0;

        if (totalTrades > 0) {

            winRate =
                (winningTrades / totalTrades) * 100;
        }

        winRateDisplay.textContent =
            `${winRate.toFixed(1)}%`;
    }


    if (tradesDisplay) {

        tradesDisplay.textContent =
            totalTrades;
    }
}


// ============================================================
// CONTRACT SYSTEM
// ============================================================

function updateContract() {

    if (!contractSelect) return;

    const contract =
        contractSelect.value;


    if (contract === "Matches / Differs") {

        digitInput.style.display = "block";

        matchButton.textContent =
            "MATCH";

        differButton.textContent =
            "DIFFER";
    }


    else if (contract === "Even / Odd") {

        digitInput.style.display = "none";

        matchButton.textContent =
            "EVEN";

        differButton.textContent =
            "ODD";
    }


    else if (contract === "Over / Under") {

        digitInput.style.display = "block";

        matchButton.textContent =
            "OVER";

        differButton.textContent =
            "UNDER";
    }


    else if (contract === "Rise / Fall") {

        digitInput.style.display = "none";

        matchButton.textContent =
            "RISE";

        differButton.textContent =
            "FALL";
    }
}


if (contractSelect) {

    contractSelect.addEventListener(
        "change",
        updateContract
    );
}

updateContract();


// ============================================================
// SYSTEM MESSAGE
// ============================================================

function showTradeMessage(action) {

    const contract =
        contractSelect.value;

    const digit =
        digitInput.value;

    const stake =
        parseFloat(stakeInput.value);


    systemMessage.innerHTML = `

        <p>
            CONTRACT: ${contract}
        </p>

        <p>
            PREDICTION: ${action}
        </p>

        ${
            digitInput.style.display !== "none"
            ? `<p>DIGIT: ${digit}</p>`
            : ""
        }

        <p>
            STAKE: $${stake.toFixed(2)}
        </p>

        <p>
            MARKET DIGIT: ${currentDigit}
        </p>

        <p>
            STATUS: PENDING
        </p>
    `;
}


// ============================================================
// TRADE HISTORY
// ============================================================

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

        <span>
            ${tradeNumber}
        </span>

        <span>
            ${contract}
        </span>

        <span>
            ${action}
        </span>

        <span>
            ${
                digitInput.style.display !== "none"
                ? digit
                : "—"
            }
        </span>

        <span>
            $${stake.toFixed(2)}
        </span>

        <span>
            PENDING
        </span>

        <span>
            —
        </span>
    `;


    tradeHistory.appendChild(row);
}


// ============================================================
// TRADE BUTTONS
// ============================================================

if (matchButton) {

    matchButton.addEventListener(
        "click",
        function () {

            const action =
                matchButton.textContent;

            showTradeMessage(action);

            addTradeToHistory(action);
        }
    );
}


if (differButton) {

    differButton.addEventListener(
        "click",
        function () {

            const action =
                differButton.textContent;

            showTradeMessage(action);

            addTradeToHistory(action);
        }
    );
}


// ============================================================
// RESULT SYSTEM
// ============================================================

function updateLatestTradeResult(result) {

    const rows =
        tradeHistory.querySelectorAll(
            ".history-row"
        );


    if (rows.length === 0) {

        systemMessage.innerHTML = `

            <p>
                NO TRADE AVAILABLE
            </p>

            <p>
                STATUS: WAITING
            </p>
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
        resultCell.textContent.trim()
        !== "PENDING"
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


    if (result === "WIN") {

        profitLoss =
            stake;

        balance += stake;

        totalProfit += stake;

        winningTrades++;

    } else {

        profitLoss =
            -stake;

        balance -= stake;

        totalProfit -= stake;

        losingTrades++;
    }


    totalTrades++;


    resultCell.textContent =
        result;


    profitCell.textContent =

        profitLoss >= 0

        ? `+$${profitLoss.toFixed(2)}`

        : `-$${Math.abs(profitLoss).toFixed(2)}`;


    updateAccountDisplay();


    updateXP(result);


    updateAnalysis(result, stake);


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
            MARKET DIGIT:
            ${currentDigit}
        </p>

        <p>
            STATUS: COMPLETE
        </p>
    `;
}


// ============================================================
// RESULT BUTTONS
// ============================================================

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


// ============================================================
// XP SYSTEM
// ============================================================

function updateXP(result) {

    if (result === "WIN") {

        xp += 100;

        classScore += 0.5;

    } else {

        xp -= 25;

        classScore -= 0.2;
    }


    xp =
        Math.max(0, xp);


    classScore =
        Math.max(
            0,
            Math.min(100, classScore)
        );


    if (xp >= xpRequired) {

        xp -= xpRequired;

        level++;

        xpRequired += 500;


        systemMessage.innerHTML += `

            <p>
                LEVEL UP → LEVEL ${level}
            </p>
        `;
    }
}


// ============================================================
// ANALYSIS SYSTEM
// ============================================================

function updateAnalysis(
    result,
    stake
) {

    discipline += 0.3;


    const riskPercentage =
        balance > 0
        ? (stake / balance) * 100
        : 100;


    if (riskPercentage <= 10) {

        riskControl += 0.5;

    } else if (riskPercentage <= 20) {

        riskControl += 0.2;

    } else {

        riskControl -= 0.5;
    }


    consistency =
        74 +
        Math.min(
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


    updateAnalysisDisplay();
}


// ============================================================
// ANALYSIS DISPLAY
// ============================================================

function updateAnalysisDisplay() {

    if (!statElements.length) return;


    const values = [

        discipline,

        riskControl,

        consistency

    ];


    statElements.forEach(
        (stat, index) => {

            const strong =
                stat.querySelector("strong");

            const bar =
                stat.querySelector(
                    ".progress div"
                );


            if (strong) {

                strong.textContent =
                    `${values[index].toFixed(0)}%`;
            }


            if (bar) {

                bar.style.width =
                    `${values[index]}%`;
            }
        }
    );
}


// ============================================================
// MARKET ENGINE
// ============================================================

// Generate a realistic-looking
// simulated tick.

function generateTick() {

    previousPrice =
        currentPrice;


    const movement =
        (Math.random() - 0.5)
        * 12;


    currentPrice +=
        movement;


    currentPrice =
        Math.max(
            1000,
            currentPrice
        );


    const priceString =
        currentPrice
            .toFixed(4);


    currentDigit =
        parseInt(
            priceString[
                priceString.length - 1
            ]
        );


    tickHistory.push({

        price:
            currentPrice,

        digit:
            currentDigit,

        time:
            new Date()
                .toLocaleTimeString()

    });


    if (
        tickHistory.length
        > MAX_TICKS
    ) {

        tickHistory.shift();
    }


    updateMarketDisplay();

    updateMarketAnalysis();
}


// ============================================================
// MARKET DISPLAY
// ============================================================

function updateMarketDisplay() {

    if (!currentPriceDisplay)
        return;


    currentPriceDisplay.textContent =
        currentPrice.toFixed(4);
}


// ============================================================
// MARKET ANALYSIS
// ============================================================

function updateMarketAnalysis() {

    if (
        tickHistory.length === 0
    ) {
        return;
    }


    const digits =
        tickHistory.map(
            tick => tick.digit
        );


    const counts =
        Array(10).fill(0);


    digits.forEach(
        digit => {

            counts[digit]++;
        }
    );


    let highestDigit = 0;

    let highestCount = 0;


    counts.forEach(
        (count, digit) => {

            if (
                count > highestCount
            ) {

                highestCount =
                    count;

                highestDigit =
                    digit;
            }
        }
    );


    const evenCount =
        digits.filter(
            digit =>
                digit % 2 === 0
        ).length;


    const oddCount =
        digits.length -
        evenCount;


    const analysisCards =
        document.querySelectorAll(
            ".analysis-card"
        );


    if (
        analysisCards.length >= 4
    ) {

        analysisCards[0]
            .querySelector("strong")
            .textContent =
            `${highestDigit} (${highestCount})`;


        analysisCards[0]
            .querySelector("small")
            .textContent =
            "Most frequent digit";


        const evenPercentage =
            (
                evenCount /
                digits.length
            ) * 100;


        analysisCards[1]
            .querySelector("strong")
            .textContent =
            `${evenPercentage.toFixed(0)}% EVEN`;


        analysisCards[1]
            .querySelector("small")
            .textContent =
            `${oddCount} odd / ${evenCount} even`;


        const overCount =
            digits.filter(
                digit => digit > 4
            ).length;


        const underCount =
            digits.length -
            overCount;


        const overPercentage =
            (
                overCount /
                digits.length
            ) * 100;


        analysisCards[2]
            .querySelector("strong")
            .textContent =
            `${overPercentage.toFixed(0)}% OVER`;


        analysisCards[2]
            .querySelector("small")
            .textContent =
            `${overCount} over / ${underCount} under`;


        const lastDigit =
            digits[digits.length - 1];


        analysisCards[3]
            .querySelector("strong")
            .textContent =
            lastDigit;


        analysisCards[3]
            .querySelector("small")
            .textContent =
            "Latest market digit";
    }
}


// ============================================================
// MARKET SELECTOR
// ============================================================

if (marketSelect) {

    marketSelect.addEventListener(
        "change",
        function () {

            const selected =
                marketSelect.value;


            const volatilityDisplay =
                document.querySelector(
                    ".market-volatility"
                );


            if (
                volatilityDisplay
            ) {

                volatilityDisplay.textContent =
                    selected
                        .replace(
                            " Index",
                            ""
                        )
                        .toUpperCase();
            }


            systemMessage.innerHTML = `

                <p>
                    MARKET SELECTED:
                    ${selected}
                </p>

                <p>
                    STATUS:
                    SIMULATED DATA
                </p>

                <p>
                    LIVE DERIV CONNECTION:
                    NOT CONNECTED
                </p>
            `;
        }
    );
}


// ============================================================
// SIMULATED MARKET LOOP
// ============================================================

// Generate a new tick
// every 1.2 seconds.

setInterval(
    generateTick,
    1200
);


// ============================================================
// INITIALIZATION
// ============================================================

updateAccountDisplay();

updateAnalysisDisplay();

generateTick();


// ============================================================
// CONSOLE
// ============================================================

console.log(
    "TRADECORE MARKET ENGINE ONLINE"
);

console.log(
    "DATA SOURCE: SIMULATED TICKS"
);

console.log(
    "DERIV WEBSOCKET: NOT CONNECTED"
);
```


