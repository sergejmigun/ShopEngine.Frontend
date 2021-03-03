app.registerComponent('inputsList', 'Services.validation.controls', [
    'Promise',
    'Collections',
    function (promise, collections) {
        'use strict';
        var inputsListValidation = {
            validate: function (control, message, validationFunc, validateControl) {
                var resultPromises = [];
                resultPromises.push(validationFunc(control.value()).then(function (status) {
                    return {
                        status: status
                    };
                }));
                collections.safeForeach(control.getAllControls(), function (innerControl) {
                    resultPromises.push(validateControl(innerControl));
                });
                return promise.all(resultPromises).then(function (results) {
                    var validationStatus = Services.ValidationStatus.Success, invalidData = [];
                    collections.foreach(results, function (result, index) {
                        if (result.status === Services.ValidationStatus.Fail) {
                            validationStatus = Services.ValidationStatus.Fail;
                        }
                        else if (result.status === Services.ValidationStatus.Warning) {
                            if (validationStatus === Services.ValidationStatus.Success) {
                                validationStatus = Services.ValidationStatus.Warning;
                            }
                        }
                        if (index > 0 && result.status !== Services.ValidationStatus.Success) {
                            invalidData.push({
                                index: index - 1,
                                message: message,
                                data: result.data
                            });
                        }
                    });
                    return {
                        status: validationStatus,
                        data: invalidData
                    };
                });
            }
        };
        return inputsListValidation;
    }
]);
