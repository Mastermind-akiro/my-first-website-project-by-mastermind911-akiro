
// TRADECORE LIVE MARKET FEED

const derivSocket = new WebSocket(
    "wss://api.derivws.com/trading/v1/options/ws/public"
);

const currentPrice = document.getElementById("currentPrice");
const systemMessage = document.getElementById("systemMessage");

derivSocket.onopen = function () {

    console.log("DERIV CONNECTED");

    derivSocket.send(JSON.stringify({
        ticks: "1HZ100V",
        subscribe: 1,
        req_id: 1
    }));

    if (systemMessage) {
        systemMessage.innerHTML =
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
    if (currentPrice) {
        currentPrice.textContent = price.toFixed(3);
    }

    // Extract latest digit
    const priceText = price.toFixed(3);
    const lastDigit = priceText.charAt(priceText.length - 1);

    console.log("LATEST DIGIT:", lastDigit);

    // Update system status
    if (systemMessage) {
        systemMessage.innerHTML =
            "<p>MARKET ONLINE</p>" +
            "<p>Volatility 100 Index</p>" +
            "<p>Latest digit: " + lastDigit + "</p>";
    }
};

derivSocket.onerror = function () {

    console.error("DERIV CONNECTION ERROR");

    if (systemMessage) {
        systemMessage.innerHTML =
            "<p>MARKET CONNECTION ERROR</p>" +
            "<p>Unable to receive market data.</p>";
    }
};

derivSocket.onclose = function () {

    console.log("DERIV DISCONNECTED");

    if (systemMessage) {
        systemMessage.innerHTML =
            "<p>MARKET DISCONNECTED</p>" +
            "<p>Connection to market data closed.</p>";
    }
};

