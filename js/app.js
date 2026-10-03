const tg = window.Telegram?.WebApp;

/* =========================
   TELEGRAM
========================= */

if (tg) {
    tg.ready();
    tg.expand();

    if (typeof tg.disableVerticalSwipes === "function") {
        tg.disableVerticalSwipes();
    }
}


/* =========================
   VIEWPORT
========================= */

function updateViewport() {

    if (!tg) return;

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


/* =========================
   PLAYER
========================= */

let balance = 10000;

const CASE_PRICE = 500;

const balanceElement =
    document.getElementById("balance");

const openCaseButton =
    document.getElementById("openCaseButton");


function updateBalance() {

    if (!balanceElement) return;

    balanceElement.textContent =
        balance.toLocaleString("ru-RU");
}


/* =========================
   RANDOM CAR
========================= */

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


/* =========================
   RESULT WINDOW
========================= */

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


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                result.classList.remove(
                    "show"
                );

                setTimeout(() => {

                    result.remove();

                }, 250);

            }
        );
    }
}


/* =========================
   OPEN CASE
========================= */

if (openCaseButton) {

    openCaseButton.addEventListener(
        "click",
        function () {

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


            if (
                tg &&
                tg.HapticFeedback
            ) {

                tg.HapticFeedback
                    .impactOccurred("medium");
            }


            setTimeout(() => {

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


                if (
                    tg &&
                    tg.HapticFeedback
                ) {

                    tg.HapticFeedback
                        .notificationOccurred(
                            "success"
                        );
                }


                /*
                 * Обновляем профиль,
                 * если profile.js подключен
                 */

                if (
                    typeof registerCaseOpening ===
                    "function"
                ) {

                    registerCaseOpening(car);
                }

            }, 1200);

        }
    );
}


/* =========================
   SIDE MENU
========================= */

const sideMenu =
    document.getElementById("sideMenu");

const menuOverlay =
    document.getElementById("menuOverlay");

const menuButton =
    document.getElementById("menuButton");

const closeMenuButton =
    document.getElementById("closeMenuButton");


function openMenu() {

    if (sideMenu) {

        sideMenu.classList.add("open");
        sideMenu.classList.add("active");

        sideMenu.setAttribute(
            "aria-hidden",
            "false"
        );
    }


    if (menuOverlay) {

        menuOverlay.classList.add("open");
        menuOverlay.classList.add("active");

        menuOverlay.setAttribute(
            "aria-hidden",
            "false"
        );
    }
}


function closeMenu() {

    if (sideMenu) {

        sideMenu.classList.remove("open");
        sideMenu.classList.remove("active");

        sideMenu.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    if (menuOverlay) {

        menuOverlay.classList.remove("open");
        menuOverlay.classList.remove("active");

        menuOverlay.setAttribute(
            "aria-hidden",
            "true"
        );
    }
}


if (menuButton) {

    menuButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            openMenu();

        }
    );
}


if (closeMenuButton) {

    closeMenuButton.addEventListener(
        "click",
        function () {

            closeMenu();

        }
    );
}


if (menuOverlay) {

    menuOverlay.addEventListener(
        "click",
        function () {

            closeMenu();

        }
    );
}


/* =========================
   MENU BUTTONS
========================= */

const menuButtons =
    document.querySelectorAll(
        ".side-menu-item"
    );


menuButtons.forEach(button => {

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            /*
             * Профиль обрабатывается
             * отдельным обработчиком
             */

            if (
                button.id ===
                "profileMenuButtonSide"
            ) {

                closeMenu();

                return;
            }


            if (
                button.id ===
                "profileMenuButton"
            ) {

                closeMenu();

                return;
            }


            const strong =
                button.querySelector(
                    "strong"
                );


            const title =
                strong
                    ? strong.textContent.trim()
                    : "Раздел";


            closeMenu();


            alert(
                `Раздел «${title}» пока находится в разработке 🚧`
            );

        }
    );

});


/* =========================
   NAVIGATION
========================= */

const navButtons =
    document.querySelectorAll(
        ".nav-button"
    );


navButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            navButtons.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            /*
             * Профиль открывается
             * отдельным обработчиком
             */

            if (
                button.id ===
                "profileNavButton"
            ) {

                return;
            }


            const span =
                button.querySelector(
                    "span"
                );


            const section =
                span
                    ? span.textContent.trim()
                    : "Раздел";


            alert(
                `Раздел «${section}» пока находится в разработке 🚧`
            );

        }
    );

});


/* =========================
   INITIALIZATION
========================= */

updateBalance();