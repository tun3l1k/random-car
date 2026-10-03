/* =====================================================
   RANDOM CAR — APP
   ===================================================== */


/* =====================================================
   TELEGRAM
   ===================================================== */

const tg = window.Telegram?.WebApp;

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

if (tg && typeof tg.onEvent === "function") {
    tg.onEvent(
        "viewportChanged",
        updateViewport
    );
}


/* =====================================================
   ИГРОК
   ===================================================== */

const CASE_PRICE = 500;

let balance = Number(
    localStorage.getItem("randomCarBalance")
);

if (!Number.isFinite(balance)) {
    balance = 10000;
}


/* =====================================================
   КОЛЛЕКЦИЯ
   ===================================================== */

let collection = [];

try {

    collection = JSON.parse(
        localStorage.getItem(
            "randomCarCollection"
        ) || "[]"
    );

    if (!Array.isArray(collection)) {
        collection = [];
    }

} catch (error) {

    collection = [];

}


/* =====================================================
   СОХРАНЕНИЕ
   ===================================================== */

function saveGame() {

    localStorage.setItem(
        "randomCarBalance",
        String(balance)
    );

    localStorage.setItem(
        "randomCarCollection",
        JSON.stringify(collection)
    );
}


/* =====================================================
   ЭЛЕМЕНТЫ
   ===================================================== */

const balanceElement =
    document.getElementById("balance");

const openCaseButton =
    document.getElementById("openCaseButton");

const casesButton =
    document.getElementById("casesButton");


/* =====================================================
   БАЛАНС
   ===================================================== */

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

    let currentChance = 0;

    for (const car of cars) {

        currentChance += car.chance;

        if (random <= currentChance) {
            return car;
        }
    }

    return cars[cars.length - 1];
}


/* =====================================================
   КОЛЛЕКЦИЯ
   ===================================================== */

function isDuplicate(car) {

    return collection.includes(car.id);
}


function addCarToCollection(car) {

    collection.push(car.id);

    saveGame();
}


/* =====================================================
   УВЕДОМЛЕНИЕ
   ===================================================== */

function showMessage(message) {

    if (
        tg &&
        typeof tg.showAlert === "function"
    ) {

        tg.showAlert(message);

    } else {

        alert(message);
    }
}


/* =====================================================
   ОКНО РЕЗУЛЬТАТА
   ===================================================== */

function createResultWindow(car) {

    const oldWindow =
        document.querySelector(".case-result");

    if (oldWindow) {
        oldWindow.remove();
    }


    const duplicate =
        isDuplicate(car);


    const result =
        document.createElement("div");

    result.className =
        "case-result";


    result.innerHTML = `

        <div class="case-result-card">

            <div class="result-title">
                ${
                    duplicate
                        ? "ДУБЛИКАТ"
                        : "ТЕБЕ ВЫПАЛО"
                }
            </div>


            <div class="result-car">
                ${car.emoji}
            </div>


            <div class="result-name">
                ${car.name}
            </div>


            <div class="
                result-rarity
                rarity-${car.rarity}
            ">
                ${car.rarityName}
            </div>


            <div class="result-price">
                Стоимость:
                <b>
                    ${car.price.toLocaleString("ru-RU")} 🪙
                </b>
            </div>


            <div class="result-actions">

                <button
                    class="result-keep"
                    type="button"
                >
                    🚗 ЗАБРАТЬ
                </button>


                <button
                    class="result-sell"
                    type="button"
                >
                    🪙 ПРОДАТЬ
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(result);


    requestAnimationFrame(() => {

        result.classList.add("show");

    });


    const keepButton =
        result.querySelector(
            ".result-keep"
        );

    const sellButton =
        result.querySelector(
            ".result-sell"
        );


    /* =================================================
       ЗАКРЫТЬ ОКНО
       ================================================= */

    function closeResult() {

        result.classList.remove(
            "show"
        );

        setTimeout(() => {

            result.remove();

        }, 250);
    }


    /* =================================================
       ЗАБРАТЬ
       ================================================= */

    keepButton.addEventListener(
        "click",
        () => {

            addCarToCollection(car);

            closeResult();

        }
    );


    /* =================================================
       ПРОДАТЬ
       ================================================= */

    sellButton.addEventListener(
        "click",
        () => {

            /*
             * Пока экономика продажи
             * не подключена.
             *
             * Поэтому автомобиль
             * просто закрывает окно.
             */

            showMessage(
                "Система продажи будет добавлена позже 🪙"
            );

            closeResult();

        }
    );
}


/* =====================================================
   ОТКРЫТИЕ КЕЙСА
   ===================================================== */

if (openCaseButton) {

    openCaseButton.addEventListener(
        "click",
        () => {

            if (balance < CASE_PRICE) {

                showMessage(
                    "Недостаточно монет!"
                );

                return;
            }


            /*
             * Снимаем стоимость кейса.
             */

            balance -= CASE_PRICE;

            saveGame();
            updateBalance();


            /*
             * Блокируем кнопку
             * на время открытия.
             */

            openCaseButton.disabled = true;

            openCaseButton.classList.add(
                "case-opening"
            );

            openCaseButton.textContent =
                "🎁 ОТКРЫВАЕМ...";


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

            }, 1200);

        }
    );
}


/* =====================================================
   БУРГЕР-МЕНЮ
   ===================================================== */

const sideMenu =
    document.getElementById(
        "sideMenu"
    );

const menuOverlay =
    document.getElementById(
        "menuOverlay"
    );

const menuButton =
    document.getElementById(
        "menuButton"
    );

const closeMenuButton =
    document.getElementById(
        "closeMenuButton"
    );


function openMenu() {

    if (!sideMenu || !menuOverlay) {
        return;
    }

    sideMenu.classList.add(
        "open"
    );

    menuOverlay.classList.add(
        "open"
    );

    sideMenu.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeMenu() {

    if (!sideMenu || !menuOverlay) {
        return;
    }

    sideMenu.classList.remove(
        "open"
    );

    menuOverlay.classList.remove(
        "open"
    );

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
   МЕНЮ
   ===================================================== */

document.addEventListener(
    "click",
    (event) => {

        const target =
            event.target;

        if (!(target instanceof Element)) {
            return;
        }


        const item =
            target.closest(
                ".side-menu-item"
            );

        if (!item) {
            return;
        }


        const title =
            item
                .querySelector("strong")
                ?.textContent
                ?.trim();


        closeMenu();


        if (title === "Коллекция") {

            showCollection();

            return;
        }


        if (title === "Кейсы") {

            showMessage(
                "Раздел кейсов скоро будет здесь 🎁"
            );

            return;
        }


        if (title === "Апгрейд") {

            showMessage(
                "Апгрейд скоро будет доступен ⬆️"
            );

            return;
        }


        showMessage(
            `Раздел «${title}» пока находится в разработке 🚧`
        );

    }
);


/* =====================================================
   КНОПКА КЕЙСОВ
   ===================================================== */

if (casesButton) {

    casesButton.addEventListener(
        "click",
        () => {

            showMessage(
                "Раздел кейсов скоро будет здесь 🎁"
            );

        }
    );
}


/* =====================================================
   КОЛЛЕКЦИЯ
   ===================================================== */

function showCollection() {

    const oldScreen =
        document.querySelector(
            ".collection-screen"
        );

    if (oldScreen) {
        oldScreen.remove();
    }


    const owned =
        new Map();


    for (const id of collection) {

        owned.set(
            id,
            (owned.get(id) || 0) + 1
        );
    }


    const uniqueCount =
        new Set(collection).size;


    const screen =
        document.createElement("div");

    screen.className =
        "collection-screen";


    const cards =
        cars
            .map((car) => {

                const count =
                    owned.get(car.id) || 0;


                return `

                    <div
                        class="
                            collection-car
                            ${
                                count
                                    ? "owned"
                                    : "locked"
                            }
                        "
                    >

                        <div
                            class="
                                collection-car-icon
                            "
                        >
                            ${
                                count
                                    ? car.emoji
                                    : "❓"
                            }
                        </div>


                        <div
                            class="
                                collection-car-info
                            "
                        >

                            <strong>
                                ${
                                    count
                                        ? car.name
                                        : "Неизвестный автомобиль"
                                }
                            </strong>


                            <span
                                class="
                                    rarity-${car.rarity}
                                "
                            >
                                ${
                                    count
                                        ? car.rarityName
                                        : "Не получено"
                                }
                            </span>

                        </div>


                        ${
                            count
                                ? `
                                    <b
                                        class="
                                            collection-count
                                        "
                                    >
                                        ×${count}
                                    </b>
                                `
                                : ""
                        }

                    </div>

                `;

            })
            .join("");


    screen.innerHTML = `

        <div class="collection-panel">

            <div class="collection-header">

                <div>

                    <small>
                        RANDOM CAR
                    </small>

                    <h2>
                        🚗 Коллекция
                    </h2>

                </div>


                <button
                    class="collection-close"
                    type="button"
                >
                    ✕
                </button>

            </div>


            <div class="collection-progress">

                Собрано:

                <b>
                    ${uniqueCount}/${cars.length}
                </b>

            </div>


            <div class="collection-list">

                ${cards}

            </div>

        </div>

    `;


    document.body.appendChild(
        screen
    );


    requestAnimationFrame(() => {

        screen.classList.add(
            "show"
        );

    });


    const closeButton =
        screen.querySelector(
            ".collection-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                screen.classList.remove(
                    "show"
                );

                setTimeout(() => {

                    screen.remove();

                }, 200);

            }
        );
    }
}


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
   ЗАПУСК
   ===================================================== */

updateBalance();
saveGame();