// =========================================
// RANDOM CAR — КЕЙСЫ
// =========================================
const CASES = [
    // =====================================
    // RANDOM CASE
    // =====================================
    {
        id: "random",
        name: "Random Case",
        description: "Случайный автомобиль",
        price: 500,
        currency: "coins",
        emoji: "🎁",
        season: 1,
        enabled: true
    },
    // =====================================
    // JDM CASE
    // =====================================
    {
        id: "jdm",
        name: "JDM Case",
        description: "Легендарные японские автомобили",
        price: 750,
        currency: "coins",
        emoji: "🇯🇵",
        season: 1,
        enabled: true
    },
    // =====================================
    // STREET CASE
    // =====================================
    {
        id: "street",
        name: "Street Case",
        description: "Автомобили для настоящих улиц",
        price: 1000,
        currency: "coins",
        emoji: "🏁",
        season: 1,
        enabled: true
    },
    // =====================================
    // LEGENDARY CASE
    // =====================================
    {
        id: "legendary",
        name: "Legendary Case",
        description: "Только редкие автомобили",
        price: 2500,
        currency: "coins",
        emoji: "👑",
        season: 1,
        enabled: true
    }
];
// =========================================
// ТЕКУЩИЙ КЕЙС
// =========================================
const SELECTED_CASE_STORAGE_KEY =
    "random_car_selected_case";
// =========================================
// ПОЛУЧИТЬ ДОСТУПНЫЕ КЕЙСЫ
// =========================================
function getAvailableCases() {
    return CASES.filter(
        (gameCase) =>
            gameCase.enabled === true
    );
}
// =========================================
// НАЙТИ КЕЙС ПО ID
// =========================================
function getCaseById(id) {
    return CASES.find(
        (gameCase) =>
            gameCase.id === id
    ) || null;
}
// =========================================
// СОХРАНИТЬ ВЫБРАННЫЙ КЕЙС
// =========================================
function saveSelectedCase(id) {
    const gameCase =
        getCaseById(id);
    if (!gameCase) {
        return null;
    }
    localStorage.setItem(
        SELECTED_CASE_STORAGE_KEY,
        gameCase.id
    );
    return gameCase;
}
// =========================================
// ПОЛУЧИТЬ ВЫБРАННЫЙ КЕЙС
// =========================================
function getSelectedCase() {
    const savedId =
        localStorage.getItem(
            SELECTED_CASE_STORAGE_KEY
        );
    if (savedId) {
        const savedCase =
            getCaseById(savedId);
        if (
            savedCase &&
            savedCase.enabled
        ) {
            return savedCase;
        }
    }
    // По умолчанию Random Case
    const defaultCase =
        getCaseById("random");
    return (
        defaultCase ||
        getAvailableCases()[0] ||
        null
    );
}
// =========================================
// ВЫБРАТЬ КЕЙС
// =========================================
function selectCase(id) {
    return saveSelectedCase(id);
}
// =========================================
// ЦЕНА КЕЙСА
// =========================================
function getCasePrice(id) {
    const gameCase =
        getCaseById(id);
    if (!gameCase) {
        return 0;
    }
    return Number(
        gameCase.price
    ) || 0;
}
// =========================================
// НАЗВАНИЕ КЕЙСА
// =========================================
function getCaseName(id) {
    const gameCase =
        getCaseById(id);
    if (!gameCase) {
        return "Random Case";
    }
    return gameCase.name;
}
// =========================================
// ИНИЦИАЛИЗАЦИЯ
// =========================================
document.addEventListener(
    "DOMContentLoaded",
    () => {
        // Если пользователь ещё
        // ничего не выбирал —
        // устанавливаем Random Case.
        const selected =
            getSelectedCase();
        if (selected) {
            saveSelectedCase(
                selected.id
            );
        }
    }
);