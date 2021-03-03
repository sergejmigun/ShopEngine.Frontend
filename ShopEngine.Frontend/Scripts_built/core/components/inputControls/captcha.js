app.registerComponent('captcha', 'UI', [
    '$',
    'Promise',
    'Services',
    'Shared',
    function ($, promise, defaultInputValidationHandler, eventsInitializer, shared) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper, _recaptchaId, _value, _scriptSrc = 'https://www.google.com/recaptcha/api.js?onload=recaptchaOnloadCallback&render=explicit', _scriptHtml = '<script src="' + _scriptSrc + '" async defer />', _validationHandler = defaultInputValidationHandler.init(control), _events = eventsInitializer.init(control, ['onChange', 'onRemove']);
                function setValue(value) {
                    if (value === null) {
                        if (_recaptchaId) {
                            window['grecaptcha'].reset(_recaptchaId);
                        }
                    }
                }
                function initRecaptcha(success) {
                    _recaptchaId = window['grecaptcha'].render(_$wrapper[0], {
                        sitekey: '6LeDHxATAAAAAAce_hlAEzR4lREWkEvPdY1EkZd1',
                        callback: function (secret) {
                            _value = secret;
                            _events.onChange.invoke();
                        }
                    });
                    success(control);
                }
                function init(success) {
                    _$wrapper = $('<div />');
                    container.setContent(_$wrapper);
                    if (shared.window.grecaptcha) {
                        initRecaptcha(success);
                    }
                    else {
                        shared.window.recaptchaOnloadCallback = function () {
                            initRecaptcha(success);
                        };
                        $('body').append(_scriptHtml);
                    }
                }
                // public
                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    }
                    else {
                        return _value;
                    }
                };
                control.disabled = function (disabled) {
                    if (disabled !== undefined) {
                        initData.disabled = disabled;
                    }
                    else {
                        return initData.disabled;
                    }
                };
                control.readOnly = function (readOnly) {
                    if (readOnly !== undefined) {
                        initData.readOnly = readOnly;
                    }
                    else {
                        return initData.readOnly;
                    }
                };
                control.displayError = function (error) {
                    _validationHandler.displayError(error);
                };
                control.getAllErrors = function () {
                    return _validationHandler.getAllErrors();
                };
                control.clearError = function (errorName) {
                    _validationHandler.clearError(errorName);
                };
                control.clearAllErrors = function () {
                    _validationHandler.clearAllErrors();
                };
                control.remove = function () {
                    _$wrapper.remove();
                    _events.onRemove.invoke();
                };
                control.getJQueryObject = function () {
                    return _$wrapper;
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);
