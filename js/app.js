const tg = window.Telegram?.WebApp;


/* =====================================================
   TELEGRAM
   ===================================================== */

if (tg) {
    tg.ready();
    tg.expand();

    if (typeof tg.disableVerticalSwipes === "function") {
        tg.disableVerticalSwipes();
    }
}


/* =====================================================
   VIEWPORT
   ===================================================== */

function updateViewport() {

    if (!tg) {
        return;
    }

    const height =
        tg.viewportStableHeight ||
        tg.viewportHeight;

    if (height) {

        document.documentElement.style.setProperty(
            "--app-height",
            `${height}px`
        );

    }
}

updateViewport();

if (tg) {
    tg.onEvent(
        "viewportChanged",
        updateViewport
    );
}


/* =====================================================
   BALANCE
   ===================================================== */

let balance = 10000;

const CASE_PRICE = 500;

const balanceElement =
    document.getElementById("balance");

const openCaseButton =
    document.getElementById("openCaseButton");


function updateBalance() {

    if (!balanceElement) {
        return;
    }

    balanceElement.textContent =
        balance.toLocaleString("ru-RU");
}


/* =====================================================
   RANDOM CAR
   ===================================================== */

function getRandomCar() {

    const random =
        Math.random() * 100;

    let current = 0;

    for (const car of cars) {

        current += car.chance;

        if (random <= current) {
            return car;
        }
    }

    return cars[0];
}


/* =====================================================
   RESULT WINDOW
   ===================================================== */

function createResultWindow(car) {

    const oldWindow =
        document.querySelector(".case-result");

    if (oldWindow) {
        oldWindow.remove();
    }


    const result =
        document.createElement("div");

    result.className =
        "case-result";


    result.innerHTML = `

        <div class="case-result-card">

            <div class="result-title">
                ТЕБЕ ВЫПАЛО
            </div>

            <div class="result-car">
                ${car.emoji}
            </div>

            <div class="result-name">
                ${car.name}
            </div>

            <div class="result-rarity rarity-${car.rarity}">
                ${car.rarityName}
            </div>

            <div class="result-price">
                Стоимость:
                <b>
                    ${car.price.toLocaleString("ru-RU")} 🪙
                </b>
            </div>

            <button
                class="result-close"
                type="button"
            >
                ЗАБРАТЬ
            </button>

        </div>

    `;


    document.body.appendChild(result);


    requestAnimationFrame(() => {

        result.classList.add("show");

    });


    const closeButton =
        result.querySelector(".result-close");


    closeButton.addEventListener(
        "click",
        () => {

            result.classList.remove("show");

            setTimeout(() => {

                result.remove();

            }, 250);

        }
    );
}


/* =====================================================
   OPEN CASE
   ===================================================== */

if (openCaseButton) {

    openCaseButton.addEventListener(
        "click",
        () => {

            if (balance < CASE_PRICE) {

                alert(
                    "Недостаточно монет!"
                );

                return;
            }


            balance -= CASE_PRICE;

            updateBalance();


            openCaseButton.disabled = true;

            openCaseButton.classList.add(
                "case-opening"
            );

            openCaseButton.textContent =
                "🎁 ОТКРЫВАЕМ...";


            setTimeout(
                () => {

                    const car =
                        getRandomCar();


                    openCaseButton.disabled =
                        false;

                    openCaseButton.classList.remove(
                        "case-opening"
                    );

                    openCaseButton.textContent =
                        "🎁 ОТКРЫТЬ КЕЙС";


                    createResultWindow(car);

                },
                1200
            );

        }
    );
}


/* =====================================================
   BURGER MENU
   ===================================================== */

const menuButton =
    document.getElementById("menuButton");

const closeMenuButton =
    document.getElementById("closeMenuButton");

const sideMenu =
    document.getElementById("sideMenu");

const menuOverlay =
    document.getElementById("menuOverlay");


function openMenu() {

    if (!sideMenu || !menuOverlay) {
        return;
    }

    sideMenu.classList.add("open");

    menuOverlay.classList.add("open");

    sideMenu.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeMenu() {

    if (!sideMenu || !menuOverlay) {
        return;
    }

    sideMenu.classList.remove("open");

    menuOverlay.classList.remove("open");

    sideMenu.setAttribute(
        "aria-hidden",
        "true"
    );
}


if (menuButton) {

    menuButton.addEventListener(
        "click",
        openMenu
    );

}


if (closeMenuButton) {

    closeMenuButton.addEventListener(
        "click",
        closeMenu
    );

}


if (menuOverlay) {

    menuOverlay.addEventListener(
        "click",
        closeMenu
    );

}


/* =====================================================
   MENU ITEMS
   ===================================================== */

const sideMenuItems =
    document.querySelectorAll(
        ".side-menu-item"
    );


sideMenuItems.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const title =
                    button.querySelector(
                        "strong"
                    )?.textContent ||
                    "Раздел";


                closeMenu();


                alert(
                    `Раздел «${title}» пока находится в разработке 🚧`
                );

            }
        );

    }
);


/* =====================================================
   ESCAPE
   ===================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {
            closeMenu();
        }

    }
);


/* =====================================================
   INITIALIZE
   ===================================================== */

updateBalance();