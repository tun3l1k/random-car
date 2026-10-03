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
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);

    if (!saved) {
        return { ...defaultProfile };
    }

    try {
        return {
            ...defaultProfile,
            ...JSON.parse(saved)
        };
    } catch (error) {
        return { ...defaultProfile };
    }
}


// =========================================
// СОХРАНЕНИЕ ПРОФИЛЯ
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

        const user = Telegram.WebApp.initDataUnsafe.user;

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
// XP ДЛЯ СЛЕДУЮЩЕГО УРОВНЯ
// =========================================

function getNextLevelXP(level) {
    return level * 100;
}


// =========================================
// ДОБАВИТЬ XP
// =========================================

function addProfileXP(amount) {

    const profile = getProfile();

    profile.xp += amount;

    while (
        profile.xp >= getNextLevelXP(profile.level)
    ) {

        profile.xp -= getNextLevelXP(profile.level);

        profile.level += 1;
    }

    saveProfile(profile);

    return profile;
}


// =========================================
// ЗАПИСЬ ОТКРЫТИЯ КЕЙСА
// =========================================

function registerCaseOpening(car) {

    const profile = getProfile();

    profile.openedCases += 1;

    profile.carsCount += 1;

    profile.collectionValue += Number(car.price) || 0;


    // Проверяем лучшее авто

    if (!profile.bestCar) {

        profile.bestCar = {
            name: car.name,
            rarity: car.rarity,
            rarityName: car.rarityName,
            price: car.price,
            emoji: car.emoji
        };

    } else {

        const currentBestPrice =
            Number(profile.bestCar.price) || 0;

        const newCarPrice =
            Number(car.price) || 0;

        if (newCarPrice > currentBestPrice) {

            profile.bestCar = {
                name: car.name,
                rarity: car.rarity,
                rarityName: car.rarityName,
                price: car.price,
                emoji: car.emoji
            };

        }
    }


    // За открытие кейса даём XP

    addProfileXP(25);

    return getProfile();
}


// =========================================
// ПОЛУЧИТЬ ИМЯ ДЛЯ ПРОФИЛЯ
// =========================================

function updatePlayerNames() {

    const playerName = getPlayerName();

    const elements = document.querySelectorAll(
        ".player-name"
    );

    elements.forEach(element => {
        element.textContent = playerName;
    });
}


// =========================================
// ИНИЦИАЛИЗАЦИЯ
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updatePlayerNames();

        // Создаём профиль, если его ещё нет

        const profile = getProfile();

        saveProfile(profile);

    }
);