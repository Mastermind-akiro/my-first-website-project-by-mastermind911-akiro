
// TRADECORE SCRIPT

const contract = document.getElementById("contract");
const digit = document.getElementById("digit");
const stake = document.getElementById("stake");

const matchButton = document.querySelector(".match-btn");
const differButton = document.querySelector(".differ-btn");

const systemMessage = document.getElementById("systemMessage");
const tradeHistory = document.getElementById("tradeHistory");

const winButton = document.getElementById("winButton");
const lossButton = document.getElementById("lossButton");

const marketSelect = document.getElementById("marketSelect");
const currentPrice = document.getElementById("currentPrice");

let balance = 8.35;
let profit = 0;
let trades = 0;
let wins = 0;

let discipline = 91;
let riskControl = 82;
let consistency = 74;

let tradeNumber = 0;
let ticks = [];


// ACCOUNT DISPLAY

function updateAccount() {

    const cards = document.querySelectorAll(".metric-card");

    if (cards.length >= 4) {

        cards[0].querySelector("strong").textContent =
            "$" + balance.toFixed(2);

        cards[1].querySelector("strong").textContent =
            (profit >= 0 ? "+$" : "-$") +
            Math.abs(profit).toFixed(2);

        let winRate = 0;

        if (trades > 0) {
            winRate = (wins / trades) * 100;
        }

        cards[2].querySelector("strong").textContent =
            winRate.toFixed(1) + "%";

        cards[3].querySelector("strong").textContent =
            trades;
    }
}


// CONTRACT BUTTONS

function updateContract() {

    if (contract.value === "Matches / Differs") {

        digit.style.display = "block";

        matchButton.textContent = "MATCH";
        differButton.textContent = "DIFFER";

    } else if (contract.value === "Even / Odd") {

        digit.style.display = "none";

        matchButton.textContent = "EVEN";
        differButton.textContent = "ODD";

    } else if (contract.value === "Over / Under") {

        digit.style.display = "block";

        matchButton.textContent = "OVER";
        differButton.textContent = "UNDER";

    } else if (contract.value === "Rise / Fall") {

        digit.style.display = "none";

        matchButton.textContent = "RISE";
        differButton.textContent = "FALL";
    }
}

contract.addEventListener("change", updateContract);

updateContract();


// TRADE

function createTrade(action) {

    const amount = parseFloat(stake.value);

    if (isNaN(amount) || amount <= 0) {

        systemMessage.textContent =
            "INVALID STAKE";

        return;
    }

    if (amount > balance) {

        systemMessage.textContent =
            "INSUFFICIENT BALANCE";

        return;
    }

    tradeNumber++;

    const row = document.createElement("div");

    row.className = "history-row";

    const values = [
        tradeNumber,
        contract.value,
        action,
        digit.style.display !== "none" ? digit.value : "—",
        "$" + amount.toFixed(2),
        "PENDING",
        "—"
    ];

    for (let i = 0; i < values.length; i++) {

        const cell = document.createElement("span");

        cell.textContent = values[i];

        row.appendChild(cell);
    }

    tradeHistory.appendChild(row);

    systemMessage.innerHTML =
        "<p>TRADE #" + tradeNumber + "</p>" +
        "<p>CONTRACT: " + contract.value + "</p>" +
        "<p>ACTION: " + action + "</p>" +
        "<p>STAKE: $" + amount.toFixed(2) + "</p>" +
        "<p>STATUS: PENDING</p>";
}


matchButton.addEventListener("click", function () {

    createTrade(matchButton.textContent);

});


differButton.addEventListener("click", function () {

    createTrade(differButton.textContent);

});


// RESULT

function finishTrade(result) {

    const rows =
        tradeHistory.querySelectorAll(".history-row");

    if (rows.length === 0) {

        systemMessage.textContent =
            "NO TRADE AVAILABLE";

        return;
    }

    const row =
        rows[rows.length - 1];

    const resultCell =
        row.children[5];

    const profitCell =
        row.children[6];

    if (resultCell.textContent !== "PENDING") {

        systemMessage.textContent =
            "TRADE ALREADY COMPLETE";

        return;
    }

    const amount =
        parseFloat(
            row.children[4].textContent.replace("$", "")
        );

    if (result === "WIN") {

        balance += amount;
        profit += amount;
        wins++;

        profitCell.textContent =
            "+$" + amount.toFixed(2);

    } else {

        balance -= amount;
        profit -= amount;

        profitCell.textContent =
            "-$" + amount.toFixed(2);
    }

    resultCell.textContent = result;

    trades++;

    updateAccount();

    updatePerformance();

    systemMessage.innerHTML =
        "<p>TRADE #" + tradeNumber + "</p>" +
        "<p>RESULT: " + result + "</p>" +
        "<p>BALANCE: $" + balance.toFixed(2) + "</p>" +
        "<p>STATUS: COMPLETE</p>";
}


winButton.addEventListener("click", function () {

    finishTrade("WIN");

});


lossButton.addEventListener("click", function () {

    finishTrade("LOSS");

});


// PERFORMANCE

function updatePerformance() {

    discipline += 0.3;

    consistency =
        74 + Math.min(trades * 2, 20);

    const stats =
        document.querySelectorAll(".stat");

    if (stats.length < 3) {
        return;
    }

    stats[0].querySelector("strong").textContent =
        Math.round(discipline) + "%";

    stats[0].querySelector(".progress div").style.width =
        discipline + "%";


    stats[1].querySelector("strong").textContent =
        Math.round(riskControl) + "%";


    stats[1].querySelector(".progress div").style.width =
        riskControl + "%";


    stats[2].querySelector("strong").textContent =
        Math.round(consistency) + "%";


    stats[2].querySelector(".progress div").style.width =
        consistency + "%";
}


// MARKET SIMULATION

function generateTick() {

    if (!marketSelect || !currentPrice) {
        return;
    }

    let base = 100000;

    if (marketSelect.value === "Volatility 75 Index") {
        base = 75000;
    }

    if (marketSelect.value === "Volatility 50 Index") {
        base = 50000;
    }

    if (marketSelect.value === "Volatility 25 Index") {
        base = 25000;
    }

    const movement =
        (Math.random() - 0.5) * 200;

    const price =
        base + movement;

    currentPrice.textContent =
        price.toFixed(3);

    const text =
        price.toFixed(3).replace(".", "");

    const last =
        parseInt(text.charAt(text.length - 1));

    ticks.push(last);

    if (ticks.length > 100) {
        ticks.shift();
    }

    updateAnalysis();
}


// MARKET ANALYSIS

function updateAnalysis() {

    if (ticks.length === 0) {
        return;
    }

    let even = 0;
    let over = 0;

    for (let i = 0; i < ticks.length; i++) {

        if (ticks[i] % 2 === 0) {
            even++;
        }

        if (ticks[i] > 5) {
            over++;
        }
    }

    const total = ticks.length;

    const evenPercent =
        (even / total) * 100;

    const overPercent =
        (over / total) * 100;

    const cards =
        document.querySelectorAll(".analysis-card");

    if (cards.length < 4) {
        return;
    }

    cards[0].querySelector("strong").textContent =
        ticks[ticks.length - 1];

    cards[0].querySelector("small").textContent =
        "Latest digit";


    cards[1].querySelector("strong").textContent =
        evenPercent.toFixed(1) + "% EVEN";

    cards[1].querySelector("small").textContent =
        (100 - evenPercent).toFixed(1) + "% ODD";


    cards[2].querySelector("strong").textContent =
        overPercent.toFixed(1) + "% OVER";

    cards[2].querySelector("small").textContent =
        (100 - overPercent).toFixed(1) + "% UNDER";


    cards[3].querySelector("strong").textContent =
        ticks[ticks.length - 1];

    cards[3].querySelector("small").textContent =
        "Latest market digit";
}


// MARKET CHANGE

marketSelect.addEventListener("change", function () {

    ticks = [];

    currentPrice.textContent =
        "0.000";

    systemMessage.textContent =
        "Market changed to " +
        marketSelect.value;
});


// START MARKET

setInterval(generateTick, 1200);


// START

updateAccount();

console.log("TRADECORE ONLINE");
```
