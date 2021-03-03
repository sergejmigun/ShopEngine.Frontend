app.registerComponent('passwordStrength', 'Services.validation', [
    'Promise',
    'Utils.objects',
    'Services.validation.validatonHelper',
    function (promise, objects, helper) {
        'use strict';
        function passwordValdiation(password) {
            if (!password || !objects.isString(password)) {
                return Services.ValidationStatus.Fail;
            }
            var passwordLength = objects.tryGet(password, 'length');
            if (passwordLength < 5) {
                return Services.ValidationStatus.Fail;
            }
            if (passwordLength < 7) {
                return Services.ValidationStatus.Warning;
            }
            return Services.ValidationStatus.Success;
        }
        return {
            init: function (message) {
                function defaultValidation(control) {
                    var result = passwordValdiation(control.value());
                    return promise.fromResult(result);
                }
                return helper.getValidator(defaultValidation, message);
            }
        };
    }
]);
