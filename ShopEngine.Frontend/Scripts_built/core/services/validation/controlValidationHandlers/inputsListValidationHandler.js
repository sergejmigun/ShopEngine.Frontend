app.registerComponent('inputsListValidationHandler', 'Services', [
    '$',
    'Collections',
    'Utils.objects',
    function ($, collections, objects) {
        'use strict';
        return {
            init: function (inputsList, $validationContainer) {
                function removeMessage(errorData) {
                    if (errorData.message) {
                        errorData.message.remove();
                        errorData.message = null;
                    }
                }
                function getMessage(error) {
                    return $('<span style="display: block;" />').text(error.message);
                }
                function displayItemErrors(error, errorData) {
                    var invalidControls = [];
                    collections.safeForeach(error.data, function (item) {
                        if (_controlsData[item.index]) {
                            var control = _controlsData[item.index], controlError = {
                                name: error.name,
                                message: item.message,
                                data: item.data
                            };
                            invalidControls.push(control);
                            control.onRemove(function () {
                                collections.remove(invalidControls, control);
                            });
                            control.displayError(controlError);
                        }
                    });
                    var mergeResult = collections.mergeObjectArrays(invalidControls, errorData.invalidControls);
                    collections.copy(mergeResult.first, errorData.invalidControls);
                    collections.foreach(mergeResult.second, function (control) {
                        control.clearError(error.name);
                    });
                }
                function displayError(error, errorData) {
                    if (!errorData) {
                        errorData = {
                            name: error.name,
                            invalidControls: []
                        };
                        _errorsData.push(errorData);
                    }
                    if (objects.isEmptyArray(error.data)) {
                        if (!errorData.message) {
                            errorData.message = getMessage(error);
                            $validationContainer.find(':first-child').append(errorData.message);
                        }
                    }
                    else {
                        removeMessage(errorData);
                    }
                    displayItemErrors(error, errorData);
                }
                function removeError(errorData) {
                    if (errorData) {
                        removeMessage(errorData);
                        collections.safeForeach(errorData.invalidControls, function (control) {
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
                var _controlsData = inputsList.getAllControls();
                var _handler = {
                    displayError: function (error) {
                        var errorData = getErrorData(error.name);
                        displayError(error, errorData);
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
        };
    }
]);
