app.registerComponent('inputsSetValidationHandler', 'Services', [
    'Collections',
    function (collections: ICollections) {
    'use strict';

        return {
            init: function (inputsSet) {
                function removeMessage(errorData) {
                    if (errorData.message) {
                        errorData.message.remove();
                        errorData.message = null;
                    }
                }

                function displayItemErrors(error: Services.ValidationHandlers.IInputsSetValidationError, errorData) {
                    var invalidControls = [];

                    if (!errorData) {
                        errorData = {
                            name: error.name,
                            invalidControls: []
                        };

                        _errorsData.push(errorData);
                    }

                    collections.safeForeach(error.data, function (item) {
                        var invalidControl = collections.from(_controlsData).where(c => c.name === item.name).first();

                        if (invalidControl) {
                            var controlError = {
                                    name: error.name,
                                    message: item.message,
                                    data: item.data
                                };

                            invalidControls.push(invalidControl);

                            invalidControl.onRemove(function () {
                                collections.remove(invalidControls, invalidControl);
                            });

                            invalidControl.displayError(controlError);
                        }
                    });

                    var mergeResult = collections.mergeObjectArrays(invalidControls, errorData.invalidControls);

                    collections.copy(mergeResult.first, errorData.invalidControls);
                    collections.foreach(mergeResult.second, function (control: any) {
                        control.clearError(error.name);
                    });
                }

                function removeError(errorData) {
                    if (errorData) {
                        removeMessage(errorData);

                        collections.safeForeach(errorData.invalidControls, function (control: any) {
                            control.clearError(errorData.name);
                        });
                    }
                }

                function getErrorData(errorName) {
                    return collections.from(_errorsData).first(function (errorData) {
                        return errorData.name === errorName;
                    });
                }

                var _errorsData = [];
                var _controlsData = inputsSet.getAllControls();

                var _handler: Services.ValidationHandlers.IInputsSetValidationHandler = {
                    displayError: function (error) {
                        var errorData = getErrorData(error.name);
                        displayItemErrors(error, errorData);
                    },
                    getAllErrors: function () {
                        return collections.select(_errorsData, function (errorData) {
                            return errorData.name;
                        }).toArray();
                    },
                    clearError: function (errorName) {
                        var errorData = getErrorData(errorName);

                        removeError(errorData);
                    },
                    clearAllErrors: function () {
                        return collections.foreach(_errorsData, function (errorData) {
                            removeError(errorData);
                        });
                    }
                };

                return _handler;
            }
        } as Services.ValidationHandlers.IInputsSetValidationHandlerFactory;
}]);