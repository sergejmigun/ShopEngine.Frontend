app.registerComponent('defaultInputValidationHandler', 'Services', [
    '$',
    'Collections',
    function ($, collections) {
        'use strict';
        return {
            init: function (control) {
                var validationHandler = {}, _$validationContainer, _errorsData = [];
                function getMessage(error) {
                    return $('<span style="display: block;" />').text(error.message);
                }
                function displayError(error, errorData) {
                    if (!errorData) {
                        errorData = {
                            name: error.name
                        };
                        _errorsData.push(errorData);
                    }
                    if (!_$validationContainer) {
                        _$validationContainer = $('<div class="help-block" />');
                        control.getJQueryObject().append(_$validationContainer);
                    }
                    if (errorData.message) {
                        errorData.message.text(error.message);
                    }
                    else {
                        errorData.message = getMessage(error);
                        _$validationContainer.append(errorData.message);
                    }
                    if (error.warning) {
                        control.getJQueryObject().removeClass('has-error').addClass('has-warning');
                    }
                    else {
                        control.getJQueryObject().removeClass('has-warning').addClass('has-error');
                    }
                }
                function removeError(errorData) {
                    if (errorData) {
                        errorData.message.remove();
                        collections.remove(_errorsData, errorData);
                        if (!_errorsData.length) {
                            _$validationContainer.remove();
                            _$validationContainer = null;
                            control.getJQueryObject().removeClass('has-error').removeClass('has-warning');
                        }
                    }
                }
                function getErrorData(errorName) {
                    return collections.from(_errorsData).first(function (errorData) {
                        return errorData.name === errorName;
                    });
                }
                validationHandler.displayError = function (error) {
                    var errorData = getErrorData(error.name);
                    displayError(error, errorData);
                };
                validationHandler.getAllErrors = function () {
                    return collections.select(_errorsData, function (errorData) {
                        return errorData.name;
                    }).toArray();
                };
                validationHandler.clearError = function (errorName) {
                    var errorData = getErrorData(errorName);
                    removeError(errorData);
                };
                validationHandler.clearAllErrors = function () {
                    return collections.foreach(_errorsData, function (errorData) {
                        removeError(errorData);
                    });
                };
                return validationHandler;
            }
        };
    }
]);
