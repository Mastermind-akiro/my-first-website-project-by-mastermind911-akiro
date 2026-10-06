
// TRADECORE LIVE MARKET FEED

const derivSocket = new WebSocket(
    "wss://api.derivws.com/trading/v1/options/ws/public"
);

const livePriceDisplay = document.getElementById("currentPrice");
const liveSystemMessage = document.getElementById("systemMessage");
const marketChart = document.getElementById("marketChart");
const chartContext = marketChart ? marketChart.getContext("2d") : null;

const liveDigitHistory = [];
const priceHistory = [];
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

derivSocket.onmessage = function (event) {

    const data = JSON.parse(event.data);

    if (data.msg_type !== "tick") {
        return;
    }

    const price = Number(data.tick.quote);

    console.log("LIVE PRICE:", price);
    priceHistory.push(price);

if (priceHistory.length > 100) {
    priceHistory.shift();
}

drawMarketChart();

    // Update visible price
    if (livePriceDisplay) {
        livePriceDisplay.textContent = String(data.tick.quote);
    }

    // Extract the actual latest digit from the Deriv quote
    const priceText = String(data.tick.quote);
    const lastDigit = priceText.charAt(priceText.length - 1);

    console.log("LATEST DIGIT:", lastDigit);
    liveDigitHistory.push(Number(lastDigit));

if (liveDigitHistory.length > 500) {
    liveDigitHistory.shift();
}

    // Update digit input
   

    // Update system status
    if (liveSystemMessage) {
        liveSystemMessage.innerHTML =
            "<p>MARKET ONLINE</p>" +
            "<p>Volatility 100 Index</p>" +
            "<p>Latest digit: " + lastDigit + "</p>";
    }
};

derivSocket.onerror = function () {

    console.error("DERIV CONNECTION ERROR");

    if (liveSystemMessage) {
        liveSystemMessage.innerHTML =
            "<p>MARKET CONNECTION ERROR</p>" +
            "<p>Unable to receive market data.</p>";
    }
};

derivSocket.onclose = function () {

    console.log("DERIV DISCONNECTED");

    if (liveSystemMessage) {
        liveSystemMessage.innerHTML =
            "<p>MARKET DISCONNECTED</p>" +
            "<p>Connection to market data closed.</p>";
    }
};

