app.registerComponent('rangeSlider', 'UI', [
    '$',
    'Promise',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Utils.objects',
    'Utils.strings',
    function ($, promise, defaultInputValidationHandler, eventsInitializer, objects, strings) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper, _$controlWrapper, _$readOnlyContainer, _$control, _value, _range, _validationHandler = defaultInputValidationHandler.init(control), _events = eventsInitializer.init(control, ['onChange', 'onRemove']);
                function setReadOnlyText() {
                    _$readOnlyContainer.text(strings.format('{0} - {1}', _value.from, _value.to));
                }
                function invokeChange() {
                    setReadOnlyText();
                    _events.onChange.invoke();
                }
                function showReadOnly() {
                    _$controlWrapper.hide();
                    _$readOnlyContainer.show();
                }
                function setReadOnly(readOnly) {
                    if (readOnly) {
                        showReadOnly();
                        initData.readOnly = true;
                    }
                    else {
                        _$controlWrapper.show();
                        _$readOnlyContainer.hide();
                        initData.readOnly = false;
                    }
                }
                function setDisabled(disabled) {
                    if (initData.disabled === disabled) {
                        return;
                    }
                    initData.disabled = disabled;
                    _$control['slider'](initData.disabled
                        ? "disable"
                        : "enable");
                }
                function areUiEqual(uiValue, value) {
                    if (!uiValue && !value) {
                        return true;
                    }
                    if (uiValue && value) {
                        return uiValue[0] === value.from && uiValue[1] === value.to;
                    }
                    return false;
                }
                function areEqual(value1, value2) {
                    if (!value1 && !value2) {
                        return true;
                    }
                    if (value1 && value2) {
                        return value1.from === value2.from && value1.to === value2.to;
                    }
                    return false;
                }
                function setValueFromUi(uiValue) {
                    _value = {
                        from: uiValue[0],
                        to: uiValue[1]
                    };
                }
                function setValue(value) {
                    if (!areEqual(value, _value)) {
                        _value = value;
                        _$control['slider']('setValue', [_value.from, _value.to]);
                        invokeChange();
                    }
                }
                function getValue() {
                    if (!_value) {
                        return null;
                    }
                    if (_value.from === _range.from && _value.to === _range.to) {
                        return null;
                    }
                    return objects.clone(_value);
                }
                function getDefaultRange() {
                    var from = initData.from || 0, to = initData.to || 10;
                    return {
                        from: from,
                        to: to
                    };
                }
                function init(success) {
                    _$wrapper = $('<div class="range-slider" />');
                    _$controlWrapper = $('<div />');
                    _$control = $('<input type="text" class="span2" />');
                    _$controlWrapper.append(_$control);
                    _$readOnlyContainer = $('<div />').hide();
                    _$wrapper.append(_$controlWrapper).append(_$readOnlyContainer);
                    container.setContent(_$wrapper);
                    var sliderValue;
                    _range = getDefaultRange();
                    _value = initData.value || objects.clone(_range);
                    sliderValue = [_value.from, _value.to];
                    _$control['slider']({
                        range: true,
                        value: sliderValue,
                        min: _range.from,
                        max: _range.to
                    });
                    _$control.on("change", function (slideEvt) {
                        if (!areUiEqual(slideEvt.value.newValue, _value)) {
                            setValueFromUi(slideEvt.value.newValue);
                            invokeChange();
                        }
                    });
                    setReadOnlyText();
                    if (initData.readOnly) {
                        showReadOnly();
                    }
                    setDisabled(initData.disabled);
                    success(control);
                }
                // public functions
                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    }
                    else {
                        return getValue();
                    }
                };
                control.disabled = function (disabled) {
                    if (disabled !== undefined) {
                        setDisabled(disabled);
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
            }
        };
    }
]);
