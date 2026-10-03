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
   ИГРОК
   ===================================================== */

const CASE_PRICE = 500;

let balance =
    Number(localStorage.getItem("randomCarBalance"));

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

} catch {

    collection = [];

}


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

    return cars[cars.length - 1];
}


/* =====================================================
   КОЛЛЕКЦИЯ — ПРОВЕРКА
   ===================================================== */

function isDuplicate(car) {

    return collection.includes(car.id);

}


/* =====================================================
   ДОБАВИТЬ АВТО
   ===================================================== */

function addCarToCollection(car) {

    collection.push(car.id);

    saveGame();

}


/* =====================================================
   ОКНО ВЫПАВШЕЙ МАШИНЫ
   ===================================================== */

function createResultWindow(car) {

    document
        .querySelector(".case-result")
        ?.remove();


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


            <div
                class="result-rarity rarity-${car.rarity}"
            >
                ${car.rarityName}
            </div>


            <div class="result-price">

                Стоимость:

                <b>
                    ${car.price.toLocaleString("ru-RU")}
                    🪙
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
        result.querySelector(
            ".result-close"
        );


    closeButton.addEventListener(
        "click",
        () => {

            /*
             * Только здесь автомобиль
             * окончательно попадает
             * в коллекцию.
             */

            addCarToCollection(car);


            result.classList.remove(
                "show"
            );


            setTimeout(() => {

                result.remove();

            }, 250);

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

                alert(
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


            openCaseButton.disabled =
                true;

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
   BURGER MENU
   ===================================================== */

const sideMenu =
    document.getElementById(
        "sideMenu"
    );

const menuOverlay =
    document.getElementById(
        "menuOverlay"
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


/*
 * Используем один обработчик
 * на весь документ.
 *
 * Это надёжнее работает
 * внутри Telegram Mini App.
 */

document.addEventListener(
    "click",
    (event) => {

        const target =
            event.target;


        if (!(target instanceof Element)) {
            return;
        }


        /*
         * БУРГЕР
         */

        if (
            target.closest(
                "#menuButton"
            )
        ) {

            event.preventDefault();

            openMenu();

            return;
        }


        /*
         * КРЕСТИК
         */

        if (
            target.closest(
                "#closeMenuButton"
            )
        ) {

            event.preventDefault();

            closeMenu();

            return;
        }


        /*
         * ЗАТЕМНЕНИЕ
         */

        if (
            target.closest(
                "#menuOverlay"
            )
        ) {

            closeMenu();

            return;
        }

    }
);


/* =====================================================
   ЭКРАН КОЛЛЕКЦИИ
   ===================================================== */

function showCollection() {

    document
        .querySelector(
            ".collection-screen"
        )
        ?.remove();


    /*
     * Считаем количество
     * каждой машины.
     */

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
        cars.map(
            (car) => {

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

            }
        ).join("");


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


    requestAnimationFrame(
        () => {

            screen.classList.add(
                "show"
            );

        }
    );


    const closeButton =
        screen.querySelector(
            ".collection-close"
        );


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


/* =====================================================
   ПУНКТЫ МЕНЮ
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
                .querySelector(
                    "strong"
                )
                ?.textContent
                ?.trim();


        closeMenu();


        if (
            title === "Коллекция"
        ) {

            showCollection();

            return;
        }


        alert(
            `Раздел «${title}» пока находится в разработке 🚧`
        );

    }
);


/* =====================================================
   СТИЛИ КОЛЛЕКЦИИ
   ===================================================== */

const collectionStyle =
    document.createElement(
        "style"
    );


collectionStyle.textContent = `

.collection-screen {

    position: fixed;

    inset: 0;

    z-index: 150;

    padding:
        max(18px, env(safe-area-inset-top))
        18px
        max(18px, env(safe-area-inset-bottom));

    background: #080808;

    opacity: 0;

    transform:
        translateY(12px);

    transition:
        opacity .2s ease,
        transform .2s ease;

    overflow: hidden;
}


.collection-screen.show {

    opacity: 1;

    transform:
        translateY(0);

}


.collection-panel {

    width: 100%;

    max-width: 500px;

    height: 100%;

    margin: 0 auto;

    display: flex;

    flex-direction: column;

}


.collection-header {

    display: flex;

    align-items: center;

    justify-content: space-between;

    min-height: 58px;

    border-bottom:
        1px solid
        rgba(255,255,255,.08);

}


.collection-header small {

    color: #8e8e93;

    font-size: 10px;

    letter-spacing: 2px;

    font-weight: 800;

}


.collection-header h2 {

    margin: 3px 0 0;

    font-size: 24px;

}


.collection-close {

    width: 42px;

    height: 42px;

    border-radius: 50%;

    background:
        rgba(255,255,255,.08);

    font-size: 20px;

    color: white;

}


.collection-progress {

    margin: 14px 0 10px;

    color: #8e8e93;

    font-size: 13px;

}


.collection-progress b {

    color: #fff;

}


.collection-list {

    display: flex;

    flex-direction: column;

    gap: 8px;

    overflow: auto;

    padding-bottom: 20px;

    scrollbar-width: none;

}


.collection-list::-webkit-scrollbar {

    display: none;

}


.collection-car {

    min-height: 68px;

    display: flex;

    align-items: center;

    padding: 8px 12px;

    border-radius: 18px;

    background:
        rgba(255,255,255,.055);

    border:
        1px solid
        rgba(255,255,255,.07);

}


.collection-car.locked {

    opacity: .48;

}


.collection-car-icon {

    width: 52px;

    height: 52px;

    flex: 0 0 52px;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 15px;

    background:
        rgba(255,255,255,.07);

    font-size: 30px;

}


.collection-car-info {

    min-width: 0;

    margin-left: 12px;

    display: flex;

    flex-direction: column;

    gap: 4px;

}


.collection-car-info strong {

    font-size: 14px;

}


.collection-car-info span {

    font-size: 12px;

    font-weight: 700;

}


.collection-count {

    margin-left: auto;

    color: #fff;

    font-size: 14px;

}

`;


document.head.appendChild(
    collectionStyle
);


/* =====================================================
   ESCAPE
   ===================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            closeMenu();

        }

    }
);


/* =====================================================
   ЗАПУСК
   ===================================================== */

updateBalance();

saveGame();