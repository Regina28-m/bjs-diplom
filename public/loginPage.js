"use strict"
const user = new UserForm();
user.loginFormCallback = function(data) {
    ApiConnector.login(data, response => {
        if (!response.success) user.setLoginErrorMessage(response.error);
        else location.reload();
    })
}

user.registerFormCallback = function(data) {
    ApiConnector.register(data, response => {
        if (!response.success) user.setRegisterErrorMessage(response.error);
        else location.reload();
    })
}