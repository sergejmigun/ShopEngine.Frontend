app.registerComponent('validatonHelper', 'Services.validation', [
    'Services.validation.controls.inputsList',
    'Services.validation.controls.inputsSet',
    'Services.validation.controls.localizedInput',
    function (inputsListValidation, inputsSetValidation, localizedInputValidation) {
        'use strict';
        return {
            getValidator: function (validationFunc, message) {
                function validateControl(control) {
                    var result;
                    switch (control.type) {
                        case 'inputsList':
                            result = inputsListValidation.validate(control, message, validationFunc, validateControl);
                            break;
                        case 'inputsSet':
                            result = inputsSetValidation.validate(control, message, validationFunc, validateControl);
                            break;
                        case 'localizedInput':
                            result = localizedInputValidation.validate(control, validationFunc);
                            break;
                        default:
                            result = validationFunc(control.value()).then(function (status) {
                                return {
                                    status: status
                                };
                            });
                            break;
                    }
                    return result;
                }
                return function (control) {
                    var result = validateControl(control);
                    return result.then(function (result) {
                        return {
                            result: result.status !== Services.ValidationStatus.Fail,
                            warning: result.status === Services.ValidationStatus.Warning,
                            message: message,
                            data: result.data
                        };
                    });
                };
            }
        };
    }
]);
