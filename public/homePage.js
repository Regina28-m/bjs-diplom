//Выход из личного кабинета
const logOutButton = new LogoutButton();
logOutButton.action = function() {
    ApiConnector.logout(response => checkLogout(response));
}
function checkLogout(response) {
    if (response.success == false) console.error(response.error);
    else location.reload();
}

// Получение информации о пользователе
ApiConnector.current(response => checkCurrent(response));
function checkCurrent(response) {
    if (!response.success) console.error(response.error);
    else ProfileWidget.showProfile(response.data);
}


// Получение текущих курсов валют
const ratesBoard = new RatesBoard();
getCurrentCurrency();
setInterval(getCurrentCurrency, 60000);

function getCurrentCurrency() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
        else console.error(response.error);
    })
}


// Операции с деньгами
// 1: Пополнение баланса
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = function(data) {
    ApiConnector.addMoney(data, response => dataUpdate(response, "Платеж прошел успешно"));
}
// 2: Конвертация валюты
moneyManager.conversionMoneyCallback = function(data) {
    ApiConnector.convertMoney(data, response => dataUpdate(response, "Конвертация прошла успешно"));
}
// 3: Перевод валюты
moneyManager.sendMoneyCallback = function(data) {
    ApiConnector.transferMoney(data, response => dataUpdate(response, "Перевод прошел успешно"));
}

function dataUpdate(response, message) {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(response.success, message);
    }
    else moneyManager.setMessage(response.success, response.error);
}

// Работа с избранным
// 1: Запрос начального объекта
const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => dataUpdateFavorites(response));

// 2: Добавление пользователя в избранное
favoritesWidget.addUserCallback = function(data) {
    ApiConnector.addUserToFavorites(data, response => dataUpdateFavorites(response));
}

// 3: Удаление пользователя из избранного
favoritesWidget.removeUserCallback = function(data) {
    ApiConnector.removeUserFromFavorites(data, response => dataUpdateFavorites(response));
}

function dataUpdateFavorites(response) {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
}