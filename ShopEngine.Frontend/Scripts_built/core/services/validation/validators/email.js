app.registerComponent('email', 'Services.validation', [
    'Promise',
    'Services.validation.validatonHelper',
    function (promise, helper) {
        'use strict';
        var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        function emailValdiation(str) {
            return emailRegExp.test(str) ? Services.ValidationStatus.Success : Services.ValidationStatus.Fail;
        }
        function defaultValidation(value) {
            return promise.fromResult(emailValdiation(value));
        }
        return {
            validate: function (value) {
                return defaultValidation(value);
            },
            init: function (message) {
                return helper.getValidator(defaultValidation, message);
            }
        };
    }
]);
