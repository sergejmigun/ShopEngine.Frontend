app.registerComponent('numericBox', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Utils.dom',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    function ($, promise, objects, dom, defaultInputValidationHandler, eventsInitializer) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper, _$controlWrapper, _$readOnlyLabel, _$control, _oldValue, _value, _defaultValue, _validationHandler = defaultInputValidationHandler.init(control), _events = eventsInitializer.init(control, ['onChange', 'onRemove']);
                function isCorrentNumber(value) {
                    if (objects.isNumeric(value)) {
                        if (initData.hasOwnProperty('max') && initData.max < value) {
                            return;
                        }
                        if (initData.hasOwnProperty('min') && initData.min > value) {
                            return;
                        }
                        return true;
                    }
                }
                function setUiDisabled() {
                    _$controlWrapper.find('button, input').prop('disabled', initData.disabled);
                }
                function setReadOnlyText() {
                    var val = control.value();
                    if (!objects.isNullOrUndefined(val)) {
                        _$readOnlyLabel.text(val.toFixed(initData.decimals || 0).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
                    }
                    else {
                        _$readOnlyLabel.text('');
                    }
                }
                function invokeChange() {
                    setReadOnlyText();
                    _events.onChange.invoke();
                }
                function showReadOnly() {
                    _$controlWrapper.hide();
                    setReadOnlyText();
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
                function setUIValue() {
                    _$control.val(_value);
                }
                function setValue(value) {
                    if (isCorrentNumber(value)) {
                        if (_oldValue !== value) {
                            _value = value;
                            setUIValue();
                            _oldValue = _value;
                            invokeChange();
                        }
                    }
                    else if (value === null) {
                        _value = initData.nullable
                            ? null
                            : 0;
                        if (_oldValue !== _value) {
                            setUIValue();
                            _oldValue = _value;
                            invokeChange();
                        }
                    }
                }
                function parseAndSetValue(uiValue) {
                    var res;
                    if (initData.nullable) {
                        if (!uiValue.length) {
                            _value = null;
                            return true;
                        }
                    }
                    if (!uiValue.length) {
                        _value = _defaultValue;
                        setUIValue();
                        res = true;
                    }
                    else if (isCorrentNumber(uiValue)) {
                        if (initData.decimals) {
                            _value = parseFloat(uiValue);
                        }
                        else {
                            _value = parseInt(uiValue, 10);
                        }
                        if (_oldValue === _value) {
                            res = false;
                        }
                        else {
                            res = true;
                        }
                    }
                    _oldValue = _value;
                    return res;
                }
                function init(success) {
                    _defaultValue = initData.nullable
                        ? null
                        : 0;
                    // init jquery control object
                    _$wrapper = $('<div />');
                    _$controlWrapper = $('<div class="w-100" />');
                    _$control = $('<input type="text" class="form-control numeric-box" />');
                    _$controlWrapper.append(_$control);
                    _$readOnlyLabel = $('<span class="form-property" />').hide();
                    _$wrapper.append(_$controlWrapper).append(_$readOnlyLabel);
                    if (initData.width) {
                        _$controlWrapper.width(initData.width);
                    }
                    // init basics
                    container.setContent(_$wrapper);
                    // custom logic
                    var touchSpinOptions = {
                        verticalbuttons: true,
                        forcestepdivisibility: 'none'
                    };
                    if (initData.hideButtons) {
                        touchSpinOptions.buttondown_class = 'display-none';
                        touchSpinOptions.buttonup_class = 'display-none';
                    }
                    var step = 1;
                    if (initData.decimals) {
                        var i = 0;
                        for (i = 0; i < initData.decimals; i += 1) {
                            step = step / 10;
                        }
                    }
                    if (initData.hasOwnProperty('value')) {
                        touchSpinOptions.initval = initData.value;
                        _value = initData.value;
                    }
                    objects.map(initData, touchSpinOptions, ['decimals', 'mousewheel', {
                            min: {
                                def: -1000000
                            },
                            max: {
                                def: 1000000
                            },
                            step: {
                                def: initData.step || step
                            }
                        }]);
                    objects.tryGet(_$control, 'TouchSpin').call(_$control, touchSpinOptions);
                    _$control.change(function () {
                        if (parseAndSetValue(_$control.val())) {
                            invokeChange();
                        }
                    });
                    if (initData.readOnly) {
                        showReadOnly();
                    }
                    setUiDisabled();
                    success(control);
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
                    _$wrapper.closest('.bootstrap-touchspin').remove();
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
