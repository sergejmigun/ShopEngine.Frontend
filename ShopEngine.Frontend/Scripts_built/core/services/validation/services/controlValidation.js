app.registerComponent('controlValidation', 'Services', [
    'Promise',
    'Collections',
    'Services.eventsInitializer',
    function (promise, collections, eventsInitializer) {
        'use strict';
        return {
            init: function (initData) {
                var _allControlValidators = [], _isDirty = false;
                var _validation = {
                    add: function (control, validatorName, validator) {
                        var controlValidator = {
                            name: validatorName,
                            validate: validator
                        };
                        var controlValidators = collections.from(_allControlValidators).first(function (controlValidators) {
                            return controlValidators.control === control;
                        });
                        if (!controlValidators) {
                            controlValidators = {
                                control: control,
                                validators: []
                            };
                            _allControlValidators.push(controlValidators);
                            if (initData.validateOnChange) {
                                control.onChange(function () {
                                    if (_isDirty) {
                                        validateControlMain(controlValidators);
                                    }
                                });
                            }
                        }
                        controlValidators.validators.push(controlValidator);
                        control.onRemove(function () {
                            collections.remove(_allControlValidators, function (controlValidators) {
                                return controlValidators.control === control;
                            });
                        });
                    },
                    validate: function () {
                        _isDirty = true;
                        var controlsValidationPromises = [];
                        collections.foreach(_allControlValidators, function (controlValidators) {
                            controlsValidationPromises.push(validateControlMain(controlValidators));
                        });
                        return promise.all(controlsValidationPromises).then(function (valdiationErrors) {
                            return collections.from(valdiationErrors).where(function (valdiationError) {
                                return !!valdiationError;
                            }).toArray();
                        });
                    },
                    validateControl: function (control) {
                        var controlValidators = collections.from(_allControlValidators).first(function (controlValidators) {
                            return controlValidators.control === control;
                        });
                        if (controlValidators) {
                            return validateControlMain(controlValidators);
                        }
                        return promise.empty();
                    },
                    clearValidation: function (control) {
                        control.clearAllErrors();
                        collections.remove(_allControlValidators, function (controlValidators) {
                            return controlValidators.control === control;
                        });
                    }
                };
                var _events = eventsInitializer.init(_validation, ['clearError', 'addError']);
                function validationFailed(validatorName, control, validationResult) {
                    var error = {
                        name: validatorName,
                        message: validationResult.message,
                        warning: validationResult.warning,
                        data: validationResult.data
                    };
                    control.displayError(error);
                    _events.addError.invoke({
                        control: control,
                        error: error
                    });
                    return error;
                }
                function validationSuccess(validatorName, control) {
                    control.clearError(validatorName);
                    _events.clearError.invoke({
                        control: control,
                        errorName: validatorName
                    });
                }
                function applyValidationResultToControl(validationResult, validatorName, control) {
                    function setFailed() {
                        return validationFailed(validatorName, control, validationResult);
                    }
                    if (validationResult.result && !validationResult.warning) {
                        validationSuccess(validatorName, control);
                    }
                    else {
                        return setFailed();
                    }
                }
                function validateControlMain(controlValidators) {
                    function validateControlInner(index, warning) {
                        // check if there no validators
                        if (controlValidators.validators.length <= index) {
                            if (warning) {
                                var warningError = applyValidationResultToControl({
                                    result: true,
                                    warning: true,
                                    message: warning.message,
                                    data: warning.data
                                }, warning.validatorName, controlValidators.control);
                                return promise.fromResult(warningError);
                            }
                            return promise.fromResult(null);
                        }
                        var controlValidator = controlValidators.validators[index];
                        return promise.create(function (success) {
                            controlValidator.validate(controlValidators.control).then(function (validationResult) {
                                if (validationResult.result) {
                                    var warningInfo = null;
                                    if (validationResult.warning) {
                                        warningInfo = {
                                            message: validationResult.message,
                                            validatorName: controlValidator.name,
                                            data: validationResult.data
                                        };
                                    }
                                    validateControlInner(index + 1, warningInfo).then(function (validationError) {
                                        success(validationError);
                                    });
                                }
                                else {
                                    // stop validation since error detected
                                    success(applyValidationResultToControl(validationResult, controlValidator.name, controlValidators.control));
                                }
                            });
                        });
                    }
                    controlValidators.control.clearAllErrors();
                    return validateControlInner(0);
                }
                return _validation;
            }
        };
    }
]);
