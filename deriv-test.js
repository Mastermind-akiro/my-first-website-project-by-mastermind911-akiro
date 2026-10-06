
// DERIV MARKET DATA TEST

const derivSocket = new WebSocket(
    "wss://api.derivws.com/trading/v1/options/ws/public"
);

derivSocket.onopen = function () {

    console.log("DERIV CONNECTED");

    derivSocket.send(JSON.stringify({
        ticks: "1HZ100V",
        subscribe: 1,
        req_id: 1
    }));

};

derivSocket.onmessage = function (event) {

    const data = JSON.parse(event.data);

    if (data.msg_type === "tick") {

        const price = data.tick.quote;

        console.log("LIVE PRICE:", price);

    }

};

derivSocket.onerror = function (error) {

    console.error("DERIV ERROR:", error);

};

derivSocket.onclose = function () {

    console.log("DERIV DISCONNECTED");

};

