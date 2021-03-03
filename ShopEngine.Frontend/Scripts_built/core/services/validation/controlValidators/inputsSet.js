app.registerComponent('inputsSet', 'Services.validation.controls', [
    'Promise',
    'Collections',
    function (promise, collections) {
        'use strict';
        var inputsSetValidation = {
            validate: function (control, message, validationFunc, validateControl) {
                var resultPromises = [];
                resultPromises.push({
                    name: null,
                    promise: validationFunc(control.value()).then(function (status) {
                        return {
                            status: status
                        };
                    })
                });
                collections.safeForeach(control.getAllControls(), function (innerControl) {
                    resultPromises.push({ name: innerControl.name, promise: validateControl(innerControl) });
                });
                return promise.all(collections.from(resultPromises).select(x => x.promise).toArray()).then(function (results) {
                    var validationResult = Services.ValidationStatus.Success, invalidData = [];
                    collections.foreach(results, function (result, index) {
                        if (result.status === Services.ValidationStatus.Fail) {
                            validationResult = Services.ValidationStatus.Fail;
                        }
                        else if (result.status === Services.ValidationStatus.Warning) {
                            if (validationResult === Services.ValidationStatus.Success) {
                                validationResult = Services.ValidationStatus.Warning;
                            }
                        }
                        if (index > 0 && result.status !== Services.ValidationStatus.Success) {
                            invalidData.push({
                                name: resultPromises[index].name,
                                message: message,
                                data: result.data
                            });
                        }
                    });
                    return {
                        status: validationResult,
                        data: invalidData
                    };
                });
            }
        };
        return inputsSetValidation;
    }
]);
