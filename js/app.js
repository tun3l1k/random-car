let balance = 10000;

const balanceElement = document.getElementById(“balance”);
const openCaseButton = document.getElementById(“openCaseButton”);

const menuButtons = document.querySelectorAll(”.menu-button”);
const navButtons = document.querySelectorAll(”.nav-button”);

function updateBalance() {
balanceElement.textContent = balance;
}

/* ===== ОТКРЫТИЕ КЕЙСА ===== */

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

/* ===== КНОПКИ МЕНЮ ===== */

menuButtons.forEach(function(button) {

button.addEventListener("click", function() {
    const title = button.querySelector("strong").textContent;
    alert("Раздел «" + title + "» пока находится в разработке 🚧");
});

});

/* ===== НИЖНЕЕ МЕНЮ ===== */

navButtons.forEach(function(button) {

button.addEventListener("click", function() {
    navButtons.forEach(function(item) {
        item.classList.remove("active");
    });
    button.classList.add("active");
    const section = button.querySelector("span").textContent;
    alert("Раздел «" + section + "» пока находится в разработке 🚧");
});

});

updateBalance();