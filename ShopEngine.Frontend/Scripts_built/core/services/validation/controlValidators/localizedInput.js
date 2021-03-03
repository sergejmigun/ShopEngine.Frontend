app.registerComponent('localizedInput', 'Services.validation.controls', [
    'Promise',
    'Collections',
    function (promise, collections) {
        'use strict';
        var localizedInputValidation = {
            validate: function (control, validationFunc) {
                var itemsValidationResults = collections.from(control.value().items).select(function (localizedItem) {
                    return {
                        promise: validationFunc(localizedItem.value),
                        language: localizedItem.language
                    };
                }).toArray();
                return promise.all(collections.from(itemsValidationResults).select(x => x.promise).toArray())
                    .then(function (validationResults) {
                    var validationResult = Services.ValidationStatus.Success;
                    var invalidLanguages = [];
                    collections.foreach(validationResults, function (result, i) {
                        if (result === Services.ValidationStatus.Fail) {
                            validationResult = Services.ValidationStatus.Fail;
                            invalidLanguages.push(itemsValidationResults[i].language);
                        }
                        if (result === Services.ValidationStatus.Warning) {
                            invalidLanguages.push(itemsValidationResults[i].language);
                            if (validationResult !== Services.ValidationStatus.Fail) {
                                validationResult = Services.ValidationStatus.Warning;
                            }
                        }
                    });
                    return {
                        status: validationResult,
                        data: invalidLanguages
                    };
                });
            }
        };
        return localizedInputValidation;
    }
]);
