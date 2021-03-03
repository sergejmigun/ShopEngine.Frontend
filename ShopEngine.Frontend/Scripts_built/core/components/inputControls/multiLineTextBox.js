app.registerComponent('multiLineTextBox', 'UI', [
    '$',
    'Promise',
    'Utils.dom',
    'Services.eventsInitializer',
    'Services.defaultInputValidationHandler',
    function ($, promise, dom, eventsInitializer, defaultInputValidationHandler) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper, _$controlWrapper, _$readOnlyLabel, _$control, _value = '', _validationHandler = defaultInputValidationHandler.init(control), _events = eventsInitializer.init(control, ['onChange', 'onRemove']);
                function setUiDisabled() {
                    _$control.prop('disabled', initData.disabled);
                }
                function setReadOnlyText() {
                    _$readOnlyLabel.text(control.value());
                }
                function invokeChange() {
                    setReadOnlyText();
                    _events.onChange.invoke();
                }
                function showReadOnly() {
                    _$controlWrapper.hide();
                    dom.removeCssProperty(_$readOnlyLabel, 'display');
                }
                function setReadOnly(readOnly) {
                    if (readOnly) {
                        showReadOnly();
                        initData.readOnly = true;
                    }
                    else {
                        _$controlWrapper.show();
                        _$readOnlyLabel.hide();
                        initData.readOnly = false;
                    }
                }
                function setValue(newValue) {
                    if (newValue !== _value) {
                        _value = newValue;
                        _$control.val(_value);
                        invokeChange();
                    }
                }
                function init(success) {
                    _$wrapper = $('<div />');
                    _$controlWrapper = $('<div />');
                    _$control = $('<textarea  class="form-control" />');
                    _$controlWrapper.append(_$control);
                    _$readOnlyLabel = $('<span class="form-property" />').hide();
                    _$wrapper.append(_$controlWrapper).append(_$readOnlyLabel);
                    _$control.attr('maxLength', initData.maxLength || 1000);
                    _$control.attr('rows', initData.rows || 8);
                    if (initData.height) {
                        _$control.css('height', initData.height);
                    }
                    container.setContent(_$wrapper);
                    if (initData.value) {
                        control.value(initData.value);
                    }
                    if (initData.placeholder) {
                        _$control.attr('placeholder', initData.placeholder);
                    }
                    _$control.change(function () {
                        _value = _$control.val();
                        invokeChange();
                    });
                    if (initData.readOnly) {
                        showReadOnly();
                    }
                    if (initData.autosize) {
                        _$control.autosize();
                    }
                    setUiDisabled();
                    success(control);
                }
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
                        setUiDisabled();
                    }
                    else {
                        return initData.disabled;
                    }
                };
                control.readOnly = function (readOnly) {
                    if (readOnly !== undefined) {
                        setReadOnly(readOnly);
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
            },
            inputControl: true
        };
    }
]);
