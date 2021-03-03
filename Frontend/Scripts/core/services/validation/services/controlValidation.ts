app.registerComponent('controlValidation', 'Services', [
    'Promise',
    'Collections',
    'Services.eventsInitializer',
    function (promise: IPromise,
        collections: ICollections,
        eventsInitializer: Services.Initialization.IEventsInitializer) {
        'use strict';

        interface IControlValidator<T, TControl extends UI.IInputControl<T>> {
            name: string;
            validate: Services.IControlValidationFunc<T, TControl>
        }

        interface IControlValidators<T, TControl extends UI.IInputControl<T>> {
            control: TControl;
            validators: IControlValidator<T, TControl>[];
        }

        interface IWarningInfo {
            validatorName: string;
            message: string;
            data: any;
        }

        return {
            init: function (initData) {
                var _allControlValidators: IControlValidators<any, any>[] = [],
                    _isDirty = false;

                var _validation: Services.IControlValidation = {
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

                        var controlsValidationPromises: Promise<UI.IValidationError>[] = [];

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

                function validationFailed(
                    validatorName: string,
                    control: UI.IInputControl<any>,
                    validationResult: Services.IControlValidationResult) {
                    var error: UI.IValidationError = {
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

                function validationSuccess(validatorName: string, control: UI.IInputControl<any>) {
                    control.clearError(validatorName);

                    _events.clearError.invoke({
                        control: control,
                        errorName: validatorName
                    });
                }

                function applyValidationResultToControl(
                    validationResult: Services.IControlValidationResult,
                    validatorName: string,
                    control: UI.IInputControl<any>) {
                    function setFailed() {
                        return validationFailed(
                            validatorName,
                            control,
                            validationResult);
                    }

                    if (validationResult.result && !validationResult.warning) {
                        validationSuccess(validatorName, control);
                    } else {
                        return setFailed();
                    }
                }

                function validateControlMain(controlValidators: IControlValidators<any, any>) {
                    function validateControlInner(index: number, warning?: IWarningInfo) {
                        // check if there no validators
                        if (controlValidators.validators.length <= index) {
                            if (warning) {
                                var warningError = applyValidationResultToControl({
                                        result: true,
                                        warning: true,
                                        message: warning.message,
                                        data: warning.data
                                    },
                                    warning.validatorName,
                                    controlValidators.control
                                );

                                return promise.fromResult(warningError);
                            }

                            return promise.fromResult<UI.IValidationError>(null);
                        }

                        var controlValidator = controlValidators.validators[index];

                        return promise.create<UI.IValidationError>(function (success) {
                            controlValidator.validate(controlValidators.control).then(function (validationResult) {
                                if (validationResult.result) {
                                    var warningInfo: IWarningInfo = null;

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
                                } else {
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
        } as Services.IControlValidationFactory;
    }
]);