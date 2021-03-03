app.registerComponent('colorPicker', 'UI', [
    '$',
    'Promise',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    function ($,
        promise,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        eventsInitializer: Services.Initialization.IEventsInitializer) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IColorPicker,
                    _$wrapper: JQuery,
                    _$controlWrapper: JQuery,
                    _$readOnlyWrapper: JQuery,
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove']);

                function setUiDisabled() {
                    _$controlWrapper.find('input, .input-group-addon').prop('disabled', initData.disabled);
                }

                function setReadOnlyText() {
                    var $label = $('<span />'),
                        $icon = $('<i class="color-indicator" />').css({
                            height: '16px',
                            width: '16px',
                            display: 'inline-block'
                        });

                    _$readOnlyWrapper.html('');
                    $label.text(control.value());
                    $icon.css('background-color', control.value());

                    _$readOnlyWrapper.append($icon).append($label);
                }

                function invokeChange() {
                    setReadOnlyText();
                    _events.onChange.invoke();
                }

                function showReadOnly() {
                    _$controlWrapper.hide();
                    _$readOnlyWrapper.show();
                }

                function setReadOnly(readOnly) {
                    if (readOnly) {
                        showReadOnly();
                        initData.readOnly = true;
                    } else {
                        _$controlWrapper.show();
                        _$readOnlyWrapper.hide();
                        initData.readOnly = false;
                    }
                }

                function init(success) {
                    _$wrapper = $('<div />');
                    _$controlWrapper = $('<div class="input-group">' +
                        '<input type="text" class="form-control" />' +
                        '<span class="input-group-addon"><i></i></span></div>');
                    _$readOnlyWrapper = $('<div />').hide();
                    _$wrapper.append(_$controlWrapper).append(_$readOnlyWrapper);

                    container.setContent(_$wrapper);

                    _$controlWrapper['colorpicker']().on('changeColor.colorpicker', function () {
                        invokeChange();
                    });

                    if (initData.readOnly) {
                        showReadOnly();
                    }

                    setUiDisabled();
                    success(control);
                }

                control.value = function (value) {
                    if (value !== undefined) {
                        _$controlWrapper['colorpicker']('setValue', value);
                    } else {
                        return _$controlWrapper['colorpicker']('getValue');
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
                    _$controlWrapper['colorpicker']('destroy');
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
        } as UI.IColorPickerFactory;
    }
]);