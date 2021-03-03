app.registerComponent('required', 'Services.validation', [
    'Promise',
    'Utils.strings',
    'Utils.objects',
    'Services.validation.validatonHelper',
    function (promise: IPromise,
        strings: Utils.IStrings,
        objects: Utils.IObjects,
        validatonHelper: Services.Helpers.IValidationHelper) {
        'use strict';

        function requiredStringValdiation(str) {
            return !strings.isNullOrWhiteSpace(str) ? Services.ValidationStatus.Success : Services.ValidationStatus.Fail;
        }

        function requiredArrayValdiation(arr) {
            return !objects.isEmptyArray(arr) ? Services.ValidationStatus.Success : Services.ValidationStatus.Fail;
        }

        function requiredObjectValdiation(obj) {
            return !objects.isNullOrUndefined(obj) ? Services.ValidationStatus.Success : Services.ValidationStatus.Fail;
        }

        return {
            init: function (message) {
                function defaultValidation(value) {
                    var valdiationResult: Services.ValidationStatus;

                    if (objects.isString(value)) {
                        valdiationResult = requiredStringValdiation(value);
                    } else if (objects.isArray(value)) {
                        valdiationResult = requiredArrayValdiation(value);
                    } else {
                        valdiationResult = requiredObjectValdiation(value);
                    }

                    return promise.fromResult(valdiationResult);
                }

                return validatonHelper.getValidator(defaultValidation, message);
            }
        } as Services.Validation.IRequired;
    }
]);