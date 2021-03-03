app.registerComponent('textBox', 'UI', [
    '$',
    'Promise',
    'Utils.dom',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    function ($: JQueryStatic,
        promise: IPromise,
        dom: Utils.IDom,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        eventsInitializer: Services.Initialization.IEventsInitializer) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.ITextBox,
                    _$wrapper: JQuery,
                    _$controlWrapper: JQuery,
                    _$readOnlyLabel: JQuery,
                    _$clearInput: JQuery,
                    _$control: JQuery,
                    _value = '',
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove', 'blur', 'focus']);

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
                    } else {
                        _$controlWrapper.show();
                        _$readOnlyLabel.hide();
                        initData.readOnly = false;
                    }
                }

                function initClearInput() {
                    _$clearInput = $('<span class="clear-input"><i class="fa fa-times" /></span>');
                    _$clearInput.click(function () {
                        control.value('');
                    });

                    if (!control.value()) {
                        _$clearInput.hide();
                    }

                    function toggleClearInput() {
                        if (_$control.val()) {
                            _$clearInput.show();
                        } else {
                            _$clearInput.hide();
                        }
                    }

                    _$control.on('input', toggleClearInput);
                    control.onChange(toggleClearInput);

                    _$controlWrapper.append(_$clearInput);
                    _$control.addClass('padding-r-20');
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
                    _$controlWrapper = $('<div class="text-box" />');
                    _$control = $('<input type="text" class="form-control" />');
                    _$controlWrapper.append(_$control);
                    _$readOnlyLabel = $('<span class="form-property" />').hide();
                    _$wrapper.append(_$controlWrapper).append(_$readOnlyLabel);

                    container.setContent(_$wrapper);

                    if (initData.maxLength) {
                        _$control.attr('maxlength', initData.maxLength);
                    }

                    _$control.change(function () {
                        _value = _$control.val() as string;
                        invokeChange();
                    });

                    _$control.focus(function () {
                        _events.focus.invoke();
                    });

                    _$control.blur(function () {
                        _events.blur.invoke();
                    });

                    if (initData.placeholder) {
                        _$control.attr('placeholder', initData.placeholder);
                    }

                    if (initData.readOnly) {
                        showReadOnly();
                    }

                    if (initData.value) {
                        setValue(initData.value);
                    }

                    if (initData.clearInput) {
                        initClearInput();
                    }

                    setUiDisabled();
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

                control.focus = function () {
                    _$control.focus();
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
        } as UI.ITextBoxFactory;
    }
]);