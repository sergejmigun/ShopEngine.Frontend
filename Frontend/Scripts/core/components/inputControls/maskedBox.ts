app.registerComponent('maskedBox', 'UI', [
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
                var control = {} as UI.IMaskedBox,
                    _$wrapper: JQuery,
                    _$controlWrapper: JQuery,
                    _$readOnlyLabel: JQuery,
                    _$control: JQuery,
                    _value: string,
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove']);

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
                    _$readOnlyLabel.show();
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
                    _$control = $('<input type="text" class="form-control" />');
                    _$controlWrapper.append(_$control);
                    _$readOnlyLabel = $('<span />').hide();
                    _$wrapper.append(_$controlWrapper).append(_$readOnlyLabel);

                    container.setContent(_$wrapper);

                    _$control['mask'](initData.mask);

                    if (initData.maxLength) {
                        _$control.attr('maxlength', initData.maxLength);
                    }

                    _$control.change(function () {
                        _value = _$control.val() as string;
                        invokeChange();
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
        } as UI.IMaskedBoxFactory;
    }
]);