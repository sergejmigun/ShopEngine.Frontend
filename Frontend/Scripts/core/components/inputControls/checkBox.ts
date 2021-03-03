app.registerComponent('checkBox', 'UI', [
    '$',
    'Promise',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    function ($: JQueryStatic,
        promise: IPromise,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        eventsInitializer: Services.Initialization.IEventsInitializer) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.ICheckBox,
                    _$wrapper: JQuery,
                    _$controlWrapper: JQuery,
                    _$readOnlyLabel: JQuery,
                    _$control: JQuery,
                    _value: boolean,
                    _setUIValue: (value: boolean) => void,
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove']);

                function setUiDisabled() {
                    _$control.find('input').prop('disabled', initData.disabled);

                    if (initData.disabled) {
                        _$controlWrapper.css('color', 'grey');
                    } else {
                        _$controlWrapper.removeAttr('style');
                    }
                }

                function setReadOnlyText() {
                    var text,
                        css;

                    if (_value === true) {
                        text = initData.trueText || 'True';
                        css = initData.trueTextCss;
                    } else if (_value === false) {
                        text = initData.falseText || 'False';
                        css = initData.falseTextCss;
                    } else {
                        text = initData.notSetText || 'Not set';
                        css = initData.notSetTextCss;
                    }

                    _$readOnlyLabel.text(text);

                    if (css) {
                        _$readOnlyLabel.addClass(css);
                    }
                }

                function invokeChange() {
                    setReadOnlyText();
                    _events.onChange.invoke();
                }
                function showReadOnly() {
                    _$controlWrapper.hide();
                    _$readOnlyLabel.removeAttr('style');
                }

                function setReadOnly(readOnly) {
                    if (readOnly) {
                        showReadOnly();
                        initData.readOnly = true;
                    } else {
                        _$controlWrapper.show();
                        _$readOnlyLabel.hide();
                        initData.readOnly = false;
                    }
                }

                function setValue(value) {
                    if (value === true || value === false) {
                        _value = value;
                    } else if (initData.nullable) {
                        _value = null;
                    }

                    _setUIValue(_value);
                    invokeChange();
                }

                function setBooleanInitialValue(defaultValue) {
                    if (initData.value === true || initData.value === false) {
                        _value = initData.value;
                    } else {
                        _value = defaultValue;
                    }
                    setReadOnlyText();
                }

                function initNullable() {
                    setBooleanInitialValue(null);

                    var controlHtml = '<div class="checkbox-wrapper">' +
                            '<i class="glyphicon glyphicon-ok control-label"><input type="checkbox" class="cb-true">&nbsp;' +
                            '<i class="glyphicon glyphicon-remove control-label"><input type="checkbox" class="cb-false">' +
                            '</div>';

                    _$control = $(controlHtml);
                    _$controlWrapper.append(_$control);

                    var $cbTrue = _$control.find('.cb-true'),
                        $cbFalse = _$control.find('.cb-false');

                    $cbTrue.change(function () {
                        if ($cbTrue.prop('checked')) {
                            if ($cbFalse.prop('checked')) {
                                $cbFalse.prop('checked', false);
                            }
                            _value = true;
                        } else if (!$cbFalse.prop('checked')) {
                            _value = null;
                        }

                        invokeChange();
                    });

                    $cbFalse.change(function () {
                        if ($cbFalse.prop('checked')) {
                            if ($cbTrue.prop('checked')) {
                                $cbTrue.prop('checked', false);
                            }
                            _value = false;
                        } else if (!$cbTrue.prop('checked')) {
                            _value = null;
                        }

                        invokeChange();
                    });

                    _setUIValue = function (value) {
                        if (value === true) {
                            $cbTrue.prop('checked', true);
                            $cbFalse.prop('checked', false);
                        } else if (value === false) {
                            $cbTrue.prop('checked', false);
                            $cbFalse.prop('checked', true);
                        } else {
                            $cbTrue.prop('checked', false);
                            $cbFalse.prop('checked', false);
                        }
                    };

                    _setUIValue(_value);
                }

                function initNotNullable() {
                    setBooleanInitialValue(false);

                    _$control = $('<div><label><input type="checkbox" /></label></div>');
                    _$controlWrapper.append(_$control);

                    var $cb = _$control.find('input');

                    if (initData.label) {
                        _$control.addClass('checkbox');
                        _$control.find('label').append(initData.label);
                    } else {
                        _$control.addClass('checkbox-single');
                    }

                    _setUIValue = function (value) {
                        $cb.prop('checked', value);
                    };

                    _setUIValue(_value);

                    $cb.change(function () {
                        _value = $cb.prop('checked');
                        invokeChange();
                    });
                }

                function init(success) {
                    _$wrapper = $('<div />');
                    _$controlWrapper = $('<div />');
                    _$readOnlyLabel = $('<span class="form-property" />').hide();
                    _$wrapper.append(_$controlWrapper).append(_$readOnlyLabel);

                    if (initData.nullable) {
                        initNullable();
                    } else {
                        initNotNullable();
                    }

                    setReadOnly(initData.readOnly);
                    container.setContent(_$wrapper);
                    success(control);
                }

                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    } else {
                        return _value;
                    }
                };

                control.disabled = function (disabled) {
                    if (disabled !== undefined) {
                        initData.disabled = disabled;
                        setUiDisabled();
                    } else {
                        return initData.disabled;
                    }
                };

                control.readOnly = function (readOnly) {
                    if (readOnly !== undefined) {
                        setReadOnly(readOnly);
                    } else {
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
        } as UI.ICheckBoxFactory;
    }
]);