// ========================================
// SYSTEM TERMINAL
// CONTRACT SYSTEM
// ========================================

const contractSelect = document.getElementById("contract");
const digitInput = document.getElementById("digit");
const matchButton = document.querySelector(".match-btn");
const differButton = document.querySelector(".differ-btn");


// Change buttons when contract changes
function updateContract() {

    const contract = contractSelect.value;

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


// Listen for dropdown changes
contractSelect.addEventListener("change", updateContract);


// Run when page loads
updateContract();


// ========================================
// BUTTON TEST
// ========================================

matchButton.addEventListener("click", function () {

    console.log("Selected:", matchButton.textContent);

});


differButton.addEventListener("click", function () {

    console.log("Selected:", differButton.textContent);

});


console.log("SYSTEM TERMINAL ONLINE");
