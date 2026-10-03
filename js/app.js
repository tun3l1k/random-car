onst tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();

    if (typeof tg.disableVerticalSwipes === "function") {
        tg.disableVerticalSwipes();
    }
}

function updateViewport() {
    if (!tg) return;

    const height = tg.viewportStableHeight || tg.viewportHeight;

    if (height) {
        document.documentElement.style.setProperty(
            "--app-height",
            `${height}px`
        );
    }
}

updateViewport();

if (tg) {
    tg.onEvent("viewportChanged", updateViewport);
}

let balance = 10000;
const CASE_PRICE = 500;

const balanceElement = document.getElementById("balance");
const openCaseButton = document.getElementById("openCaseButton");

function updateBalance() {
    balanceElement.textContent = balance.toLocaleString("ru-RU");
}

function getRandomCar() {
    const random = Math.random() * 100;
    let current = 0;

    for (const car of cars) {
        current += car.chance;

        if (random <= current) {
            return car;
        }
    }

    return cars[0];
}

function createResultWindow(car) {
    const oldWindow = document.querySelector(".case-result");

    if (oldWindow) oldWindow.remove();

    const result = document.createElement("div");
    result.className = "case-result";

    result.innerHTML = `
        <div class="case-result-card">
            <div class="result-title">Ð¢ÐÐÐ ÐÐ«ÐÐÐÐ</div>
            <div class="result-car">${car.emoji}</div>
            <div class="result-name">${car.name}</div>
            <div class="result-rarity rarity-${car.rarity}">
                ${car.rarityName}
            </div>
            <div class="result-price">
                Ð¡ÑÐ¾Ð¸Ð¼Ð¾ÑÑÑ:
                <b>${car.price.toLocaleString("ru-RU")} ðª</b>
            </div>
            <button class="result-close" type="button">
                ÐÐÐÐ ÐÐ¢Ð¬
            </button>
        </div>
    `;

    document.body.appendChild(result);

    requestAnimationFrame(() => {
        result.classList.add("show");
    });

    result.querySelector(".result-close").addEventListener("click", () => {
        result.classList.remove("show");

        setTimeout(() => result.remove(), 250);
    });
}

if (openCaseButton) {
    openCaseButton.addEventListener("click", () => {
        if (balance < CASE_PRICE) {
            alert("ÐÐµÐ´Ð¾ÑÑÐ°ÑÐ¾ÑÐ½Ð¾ Ð¼Ð¾Ð½ÐµÑ!");
            return;
        }

        balance -= CASE_PRICE;
        updateBalance();

        openCaseButton.disabled = true;
        openCaseButton.classList.add("case-opening");
        openCaseButton.textContent = "ð ÐÐ¢ÐÐ Ð«ÐÐÐÐ...";

        setTimeout(() => {
            const car = getRandomCar();

            openCaseButton.disabled = false;
            openCaseButton.classList.remove("case-opening");
            openCaseButton.textContent = "ð ÐÐ¢ÐÐ Ð«Ð¢Ð¬ ÐÐÐÐ¡";

            createResultWindow(car);
        }, 1200);
    });
}

document.querySelectorAll(".menu-button").forEach(button => {
    button.addEventListener("click", () => {
        const title = button.querySelector("strong").textContent;
        alert(`Ð Ð°Ð·Ð´ÐµÐ» Â«${title}Â» Ð¿Ð¾ÐºÐ° Ð½Ð°ÑÐ¾Ð´Ð¸ÑÑÑ Ð² ÑÐ°Ð·ÑÐ°Ð±Ð¾ÑÐºÐµ ð§`);
    });
});

document.querySelectorAll(".nav-button").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".nav-button").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        const section = button.querySelector("span").textContent;
        alert(`Ð Ð°Ð·Ð´ÐµÐ» Â«${section}Â» Ð¿Ð¾ÐºÐ° Ð½Ð°ÑÐ¾Ð´Ð¸ÑÑÑ Ð² ÑÐ°Ð·ÑÐ°Ð±Ð¾ÑÐºÐµ ð§`);
    });
});

updateBalance();
