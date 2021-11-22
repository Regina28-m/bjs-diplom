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
const favorites = new FavoritesWidget();

updateFavorites = (response) => {
    favorites.clearTable();
    favorites.fillTable(response.data);
    money.updateUsersList(response.data);
};

ApiConnector.getFavorites((response) => {
    if (response.success) {
        updateFavorites(response);
    }
});

favorites.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success) {
            updateFavorites(response);
            favorites.setMessage(false,'Пользователь успешно добавлен!');
        } else {
            favorites.setMessage(true, response.data);
        }
    })
};

favorites.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success) {
            updateFavorites(response);
        } else {
            favorites.setMessage(true, response.data);
        }
    })
};