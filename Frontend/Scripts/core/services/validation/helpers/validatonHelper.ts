app.registerComponent('validatonHelper', 'Services.validation', [
    'Services.validation.controls.inputsList',
    'Services.validation.controls.inputsSet',
    'Services.validation.controls.localizedInput',
    function (inputsListValidation: Services.Validation.IInputslist,
        inputsSetValidation: Services.Validation.IInputsSet,
        localizedInputValidation: Services.Validation.ILocalizedInput) {
        'use strict';

        return {
            getValidator: function (validationFunc, message) {
                function validateControl(control) {
                    var result: Promise<Services.IValidationResult>;

                    switch (control.type) {
                        case 'inputsList':
                            result = inputsListValidation.validate(control as any, message, validationFunc, validateControl);
                            break;
                        case 'inputsSet':
                            result = inputsSetValidation.validate(control as any, message, validationFunc, validateControl);
                            break;
                        case 'localizedInput':
                            result = localizedInputValidation.validate(control as any, validationFunc);
                            break;
                        default:
                            result = validationFunc(control.value()).then(function (status) {
                                return {
                                    status: status
                                };
                            })
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
        } as Services.Helpers.IValidationHelper;
    }
]);