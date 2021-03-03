app.registerComponent('dateTimePicker', 'UI', [
    '$',
    'Promise',
    'Services.eventsInitializer',
    'Services.defaultInputValidationHandler',
    'Utils.objects',
    'Utils.dates',
    function ($: JQueryStatic,
        promise: IPromise,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        objects: Utils.IObjects,
        dates: Utils.IDates) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IDateTimePicker,
                    _$wrapper: JQuery,
                    _$controlWrapper: JQuery,
                    _$readOnlyLabel: JQuery,
                    _$control: JQuery,
                    _format: string,
                    _value: Date,
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove']);

                function setUiDisabled() {
                    _$control.find('input').prop('disabled', initData.disabled);
                }

                function setReadOnlyText() {
                    var value = control.value();

                    if (!value) {
                        _$readOnlyLabel.text('No value');
                    } else {
                        _$readOnlyLabel.text(dates.format(_value, _format));
                    }
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

                function validate(value) {
                    if (!objects.isDate(value)) {
                        return false;
                    }

                    if (initData.min && initData.min > value) {
                        return false;
                    }

                    if (initData.max && initData.max < value) {
                        return false;
                    }

                    return true;
                }

                function setValueOnUi(value) {
                    _$control.data("DateTimePicker").date(value);
                }

                function validateAndSetUiValue(value) {
                    if (objects.isString(value)) {
                        value = dates.tryParse(value);
                    }

                    if (!validate(value)) {
                        return;
                    }

                    setValueOnUi(value);
                }

                function setValueFromUi(value) {
                    _value = value;
                    invokeChange();
                }

                function init(success) {
                    var defaultFormat = initData.includeTime
                        ? dates.getDefaultDateTimeFormat()
                        : dates.getDefaultDateFormat();

                    _format = initData.format || defaultFormat;

                    var html = '<div class="input-group date w-300">' +
                            '<input type="text" class="form-control" />' +
                            '<span class="input-group-addon">' +
                            '<span class="glyphicon glyphicon-calendar"></span>' +
                            '</span></div>';

                    _$wrapper = $('<div />');
                    _$controlWrapper = $('<div />');
                    _$control = $(html);
                    _$controlWrapper.append(_$control);
                    _$readOnlyLabel = $('<span />').hide();
                    _$wrapper.append(_$controlWrapper).append(_$readOnlyLabel);

                    container.setContent(_$wrapper);

                    _$control['datetimepicker']({
                        format: _format
                    });

                    _$control.on("dp.change", function (e:any) {
                        setValueFromUi(e.date.toDate());
                    });

                    if (initData.value) {
                        validateAndSetUiValue(initData.value);
                    }

                    if (initData.readOnly) {
                        showReadOnly();
                    }

                    setReadOnlyText();
                    setUiDisabled();

                    success(control);
                }

                // public functions
                control.value = function (value) {
                    if (value !== undefined) {
                        validateAndSetUiValue(value);
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
        } as UI.IDateTimePickerFactory;
    }
]);