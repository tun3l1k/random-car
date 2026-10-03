let balance = 10000;

const balanceElement = document.getElementById(“balance”);
const openCaseButton = document.getElementById(“openCaseButton”);

function updateBalance() {
balanceElement.textContent = balance;
}

openCaseButton.addEventListener(“click”, function () {

const casePrice = 500;
if (balance < casePrice) {
    alert("Недостаточно монет!");
    return;
}
balance -= casePrice;
updateBalance();
alert("Кейс открыт! 🚗");

});

updateBalance();