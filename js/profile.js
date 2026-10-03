// =========================================
// RANDOM CAR — ПРОФИЛЬ И СТАТИСТИКА
// =========================================

const PROFILE_STORAGE_KEY = "random_car_profile";

const defaultProfile = {
    level: 1,
    xp: 0,
    openedCases: 0,
    carsCount: 0,
    bestCar: null,
    collectionValue: 0
};


// =========================================
// ПОЛУЧЕНИЕ ПРОФИЛЯ
// =========================================

function getProfile() {

    const saved =
        localStorage.getItem(
            PROFILE_STORAGE_KEY
        );

    if (!saved) {
        return { ...defaultProfile };
    }

    try {

        return {
            ...defaultProfile,
            ...JSON.parse(saved)
        };

    } catch (error) {

        console.error(
            "Ошибка загрузки профиля:",
            error
        );

        return {
            ...defaultProfile
        };
    }
}


// =========================================
// СОХРАНЕНИЕ
// =========================================

function saveProfile(profile) {

    localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(profile)
    );
}


// =========================================
// ИМЯ ИГРОКА
// =========================================

function getPlayerName() {

    if (
        window.Telegram &&
        Telegram.WebApp &&
        Telegram.WebApp.initDataUnsafe &&
        Telegram.WebApp.initDataUnsafe.user
    ) {

        const user =
            Telegram.WebApp.initDataUnsafe.user;

        if (user.first_name) {
            return user.first_name;
        }

        if (user.username) {
            return "@" + user.username;
        }
    }

    return "Игрок";
}


// =========================================
// USERNAME
// =========================================

function getPlayerUsername() {

    if (
        window.Telegram &&
        Telegram.WebApp &&
        Telegram.WebApp.initDataUnsafe &&
        Telegram.WebApp.initDataUnsafe.user
    ) {

        const user =
            Telegram.WebApp.initDataUnsafe.user;

        if (user.username) {
            return "@" + user.username;
        }
    }

    return "RANDOM CAR";
}


// =========================================
// XP
// =========================================

function getNextLevelXP(level) {

    return level * 100;
}


// =========================================
// ДОБАВИТЬ XP
// =========================================

function addProfileXP(amount) {

    const profile =
        getProfile();

    profile.xp += amount;


    while (
        profile.xp >=
        getNextLevelXP(profile.level)
    ) {

        profile.xp -=
            getNextLevelXP(
                profile.level
            );

        profile.level += 1;
    }


    saveProfile(profile);

    return profile;
}


// =========================================
// СОХРАНИТЬ ОТКРЫТИЕ
// =========================================

function registerCaseOpening(car) {

    if (!car) {
        return getProfile();
    }


    const profile =
        getProfile();


    profile.openedCases += 1;

    profile.carsCount += 1;

    profile.collectionValue +=
        Number(car.price) || 0;


    // -------------------------
    // ЛУЧШАЯ МАШИНА
    // -------------------------

    const newPrice =
        Number(car.price) || 0;


    const currentBestPrice =
        profile.bestCar
            ? Number(
                profile.bestCar.price
            ) || 0
            : 0;


    if (
        !profile.bestCar ||
        newPrice > currentBestPrice
    ) {

        profile.bestCar = {

            name:
                car.name || "Неизвестный автомобиль",

            rarity:
                car.rarity || "",

            rarityName:
                car.rarityName || "",

            price:
                newPrice,

            emoji:
                car.emoji || "🚘"
        };
    }


    // -------------------------
    // XP
    // -------------------------

    profile.xp += 25;


    while (
        profile.xp >=
        getNextLevelXP(profile.level)
    ) {

        profile.xp -=
            getNextLevelXP(
                profile.level
            );

        profile.level += 1;
    }


    saveProfile(profile);

    updateProfileScreen();

    return profile;
}


// =========================================
// ОБНОВЛЕНИЕ ПРОФИЛЯ НА ЭКРАНЕ
// =========================================

function updateProfileScreen() {

    const profile =
        getProfile();


    // -------------------------
    // ИМЯ
    // -------------------------

    const playerName =
        document.getElementById(
            "profilePlayerName"
        );

    if (playerName) {

        playerName.textContent =
            getPlayerName();
    }


    // -------------------------
    // USERNAME
    // -------------------------

    const username =
        document.getElementById(
            "profileUsername"
        );

    if (username) {

        username.textContent =
            getPlayerUsername();
    }


    // -------------------------
    // УРОВЕНЬ
    // -------------------------

    const level =
        document.getElementById(
            "profileLevel"
        );

    if (level) {

        level.textContent =
            profile.level;
    }


    // -------------------------
    // XP
    // -------------------------

    const xp =
        document.getElementById(
            "profileXP"
        );

    const nextXP =
        document.getElementById(
            "profileNextXP"
        );

    const xpProgress =
        document.getElementById(
            "profileXPProgress"
        );


    const requiredXP =
        getNextLevelXP(
            profile.level
        );


    if (xp) {

        xp.textContent =
            profile.xp;
    }


    if (nextXP) {

        nextXP.textContent =
            requiredXP;
    }


    if (xpProgress) {

        const percent =
            Math.min(
                100,
                Math.max(
                    0,
                    (
                        profile.xp /
                        requiredXP
                    ) * 100
                )
            );

        xpProgress.style.width =
            percent + "%";
    }


    // -------------------------
    // БАЛАНС
    // -------------------------

    const profileBalance =
        document.getElementById(
            "profileBalance"
        );

    const mainBalance =
        document.getElementById(
            "balance"
        );


    let balance = 0;


    if (mainBalance) {

        const rawBalance =
            mainBalance.textContent
                .replace(/\s/g, "")
                .replace(/[^\d]/g, "");

        balance =
            Number(rawBalance) || 0;
    }


    if (profileBalance) {

        profileBalance.textContent =
            balance.toLocaleString(
                "ru-RU"
            );
    }


    // -------------------------
    // ОТКРЫТЫЕ КЕЙСЫ
    // -------------------------

    const openedCases =
        document.getElementById(
            "profileOpenedCases"
        );

    if (openedCases) {

        openedCases.textContent =
            profile.openedCases;
    }


    // -------------------------
    // КОЛИЧЕСТВО МАШИН
    // -------------------------

    const carsCount =
        document.getElementById(
            "profileCarsCount"
        );

    if (carsCount) {

        carsCount.textContent =
            profile.carsCount;
    }


    // -------------------------
    // СТОИМОСТЬ КОЛЛЕКЦИИ
    // -------------------------

    const collectionValue =
        document.getElementById(
            "profileCollectionValue"
        );

    if (collectionValue) {

        collectionValue.textContent =
            profile.collectionValue.toLocaleString(
                "ru-RU"
            );
    }


    // -------------------------
    // ЛУЧШАЯ МАШИНА
    // -------------------------

    updateBestCar(
        profile.bestCar
    );
}


// =========================================
// ЛУЧШАЯ МАШИНА
// =========================================

function updateBestCar(bestCar) {

    const container =
        document.getElementById(
            "profileBestCar"
        );


    if (!container) {
        return;
    }


    if (!bestCar) {

        container.innerHTML = `

            <div class="profile-best-car-emoji">
                🚘
            </div>

            <div class="profile-best-car-info">

                <div class="profile-best-car-name">
                    Пока нет машин
                </div>

                <div class="profile-best-car-rarity">
                    Открой первый кейс
                </div>

                <div class="profile-best-car-price">
                    —
                </div>

            </div>

        `;

        return;
    }


    const emoji =
        bestCar.emoji || "🚘";

    const name =
        bestCar.name || "Автомобиль";

    const rarity =
        bestCar.rarityName ||
        bestCar.rarity ||
        "Неизвестная редкость";

    const price =
        Number(bestCar.price) || 0;


    container.innerHTML = `

        <div class="profile-best-car-emoji">
            ${emoji}
        </div>

        <div class="profile-best-car-info">

            <div class="profile-best-car-name">
                ${name}
            </div>

            <div class="profile-best-car-rarity">
                ${rarity}
            </div>

            <div class="profile-best-car-price">
                ${price.toLocaleString("ru-RU")} 🪙
            </div>

        </div>

    `;
}


// =========================================
// ИНИЦИАЛИЗАЦИЯ
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const profile =
            getProfile();

        saveProfile(profile);

        updateProfileScreen();

    }
);