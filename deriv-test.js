// TRADECORE LIVE MARKET FEED

const derivSocket = new WebSocket(
    "wss://api.derivws.com/trading/v1/options/ws/public"
);

const livePriceDisplay = document.getElementById("currentPrice");
const liveSystemMessage = document.getElementById("systemMessage");

const tickHistoryDisplay = document.getElementById("tickHistory");
const latestTickDisplay = document.getElementById("latestTick");
const tickCountDisplay = document.querySelector(".tick-count");
const digitFrequencyValue = document.getElementById("digitFrequencyValue");
const digitFrequencyStatus = document.getElementById("digitFrequencyStatus");

const marketChart = document.getElementById("marketChart");
const chartContext = marketChart ? marketChart.getContext("2d") : null;

const liveDigitHistory = [];
const priceHistory = [];
const marketTickHistory = [];


// =========================================================
// MARKET CHART
// =========================================================

function drawMarketChart() {

    if (!chartContext || !marketChart || priceHistory.length < 2) {
        return;
    }

    const width = marketChart.width;
    const height = marketChart.height;

    chartContext.clearRect(0, 0, width, height);

    const minPrice = Math.min(...priceHistory);
    const maxPrice = Math.max(...priceHistory);

    const range = maxPrice - minPrice || 1;

    chartContext.beginPath();

    for (let i = 0; i < priceHistory.length; i++) {

        const x =
            (i / (priceHistory.length - 1)) * width;

        const y =
            height -
            ((priceHistory[i] - minPrice) / range) * height;

        if (i === 0) {
            chartContext.moveTo(x, y);
        } else {
            chartContext.lineTo(x, y);
        }
    }

    chartContext.stroke();
}


// =========================================================
// TICK HISTORY
// =========================================================

function updateTickHistory() {

    if (!tickHistoryDisplay) {
        return;
    }

    tickHistoryDisplay.innerHTML = "";

    // Show only the latest 10 ticks
    const visibleTicks = marketTickHistory.slice(-10);

    visibleTicks.forEach(function (digit) {

        const box = document.createElement("div");

        box.className =
            "tick-box " +
            (digit % 2 === 0 ? "green" : "red");

        box.textContent = digit;

        tickHistoryDisplay.appendChild(box);
    });

    // Always show the newest tick
    if (latestTickDisplay && marketTickHistory.length > 0) {

        latestTickDisplay.textContent =
            marketTickHistory[marketTickHistory.length - 1];
    }

    // Keep track of the full stored history
    if (tickCountDisplay) {

        tickCountDisplay.textContent =
            marketTickHistory.length + " / 500";
    }
}
function updateDigitFrequency() {

    if (!digitFrequencyValue || marketTickHistory.length === 0) {
        return;
    }

    const digitCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    marketTickHistory.forEach(function (digit) {
        digitCounts[digit]++;
    });

    const latestDigit = marketTickHistory[
        marketTickHistory.length - 1
    ];

    const frequency =
        (digitCounts[latestDigit] / marketTickHistory.length) * 100;

    digitFrequencyValue.textContent =
        latestDigit + " → " + frequency.toFixed(1) + "%";

    if (digitFrequencyStatus) {
        digitFrequencyStatus.textContent =
            "Based on " + marketTickHistory.length + " ticks";
    }
}

// =========================================================
// DERIV CONNECTION
// =========================================================

derivSocket.onopen = function () {

    console.log("DERIV CONNECTED");

    derivSocket.send(JSON.stringify({
        ticks: "1HZ100V",
        subscribe: 1,
        req_id: 1
    }));

    if (liveSystemMessage) {

        liveSystemMessage.innerHTML =
            "<p>MARKET CONNECTION ACTIVE</p>" +
            "<p>Receiving Volatility 100 tick data.</p>" +
            "<p>Waiting for first market tick...</p>";
    }
};


// =========================================================
// LIVE MARKET DATA
// =========================================================

derivSocket.onmessage = function (event) {

    const data = JSON.parse(event.data);

    if (data.msg_type !== "tick") {
        return;
    }

    const price = Number(data.tick.quote);

    console.log("LIVE PRICE:", price);

    // Store price for chart
    priceHistory.push(price);

    if (priceHistory.length > 100) {
        priceHistory.shift();
    }

    drawMarketChart();


    // =====================================================
    // UPDATE VISIBLE PRICE
    // =====================================================

    if (livePriceDisplay) {

        livePriceDisplay.textContent =
            String(data.tick.quote);
    }


    // =====================================================
    // EXTRACT ACTUAL LAST DIGIT
    // =====================================================

    const priceText = String(data.tick.quote);

    const lastDigit =
        priceText.charAt(priceText.length - 1);

    console.log("LATEST DIGIT:", lastDigit);


    // Keep existing live digit history
    liveDigitHistory.push(Number(lastDigit));

    if (liveDigitHistory.length > 500) {
        liveDigitHistory.shift();
    }


    // =====================================================
    // TICK HISTORY DISPLAY
    // =====================================================

    const digit = Number(lastDigit);

    marketTickHistory.push(digit);

    if (marketTickHistory.length > 500) {
        marketTickHistory.shift();
    }
updateTickHistory();
updateDigitFrequency();


// =====================================================
// SYSTEM STATUS
// =====================================================


    // =====================================================
    // SYSTEM STATUS
    // =====================================================

    if (liveSystemMessage) {

        liveSystemMessage.innerHTML =
            "<p>MARKET ONLINE</p>" +
            "<p>Volatility 100 Index</p>" +
            "<p>Latest digit: " + lastDigit + "</p>";
    }
};


// =========================================================
// CONNECTION ERROR
// =========================================================

derivSocket.onerror = function () {

    console.error("DERIV CONNECTION ERROR");

    if (liveSystemMessage) {

        liveSystemMessage.innerHTML =
            "<p>MARKET CONNECTION ERROR</p>" +
            "<p>Unable to receive market data.</p>";
    }
};


// =========================================================
// CONNECTION CLOSED
// =========================================================

derivSocket.onclose = function () {

    console.log("DERIV DISCONNECTED");

    if (liveSystemMessage) {

        liveSystemMessage.innerHTML =
            "<p>MARKET DISCONNECTED</p>" +
            "<p>Connection to market data closed.</p>";
    }
};
