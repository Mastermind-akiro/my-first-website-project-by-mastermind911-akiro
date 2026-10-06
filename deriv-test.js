
// TRADECORE LIVE MARKET FEED

const derivSocket = new WebSocket(
    "wss://api.derivws.com/trading/v1/options/ws/public"
);

const livePriceDisplay = document.getElementById("currentPrice");
const liveSystemMessage = document.getElementById("systemMessage");
const liveDigitHistory = [];

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

    // Update visible price
    if (livePriceDisplay) {
        livePriceDisplay.textContent = String(data.tick.quote);
    }

    // Extract the actual latest digit from the Deriv quote
    const priceText = String(data.tick.quote);
    const lastDigit = priceText.charAt(priceText.length - 1);

    console.log("LATEST DIGIT:", lastDigit);
    liveDigitHistory.push(Number(lastDigit));

if (liveDigitHistory.length > 100) {
    liveDigitHistory.shift();
}

    // Update digit input
    const digitInput = document.getElementById("digit");

    if (digitInput) {
        digitInput.value = lastDigit;
    }

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

