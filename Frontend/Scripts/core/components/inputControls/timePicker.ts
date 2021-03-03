app.registerComponent('timePicker', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Services',
    'Utils.dates',
    function (promise: IPromise,
        objects: Utils.IObjects,
        dates: Utils.IDates,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        eventsInitializer: Services.Initialization.IEventsInitializer) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.ITimePicker,
                    _$wrapper: JQuery,
                    _$controlWrapper: JQuery,
                    _$readOnlyLabel: JQuery,
                    _$control: JQuery,
                    _value: UI.Time,
                    _format: string,
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove']),
                    _fakeDate = new Date(2000, 1, 1);

                function setUiDisabled() {
                    _$control.find('input').prop('disabled', initData.disabled);
                }

                function setReadOnlyText() {
                    var value = control.value();

                    if (!value) {
                        _$readOnlyLabel.text('No value');
                    } else {
                        _$readOnlyLabel.text(dates.formatTime(value));
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

                function firstIsBigger(value1, value2) {
                    var hoursComparison = objects.compareValues(value1.hours, value2.hours);

                    if (hoursComparison !== 0) {
                        return hoursComparison === 1;
                    }

                    var minutesComparison = objects.compareValues(value1.minutes, value2.minutes);

                    if (minutesComparison !== 0) {
                        return minutesComparison === 1;
                    }

                    var secondsComparison = objects.compareValues(value1.seconds, value2.seconds);

                    if (secondsComparison !== 0) {
                        return secondsComparison === 1;
                    }

                    return false;
                }

                function isValid(value) {
                    if (initData.nullable && !value) {
                        return true;
                    }

                    if (value) {
                        if (!objects.isNumeric(value.hours) || value.hours < 0 || value.hours > 24) {
                            return false;
                        }

                        if (!objects.isNumeric(value.minutes) || value.minutes < 0 || value.minutes > 60) {
                            return false;
                        }

                        if (!objects.isNumeric(value.seconds) || value.seconds < 0 || value.seconds > 60) {
                            return false;
                        }

                        if (initData.min && firstIsBigger(initData.min, value)) {
                            return false;
                        }

                        if (initData.min && firstIsBigger(value, initData.max)) {
                            return false;
                        }

                        return true;
                    }

                    return false;
                }

                function setValueOnUi(value) {

                    _fakeDate.setHours(value.hours);
                    _fakeDate.setMinutes(value.minutes);
                    _fakeDate.setSeconds(value.seconds);

                    _$control.data("DateTimePicker").date(_fakeDate);
                }

                function validateAndSetUiValue(value) {
                    if (!isValid(value)) {
                        return;
                    }
                    setValueOnUi(value);
                }

                function setValueFromUi(value) {
                    _value = {
                        hours: value.getHours(),
                        minutes: value.getMinutes(),
                        seconds: value.getSeconds()
                    };
                    invokeChange();
                }

                function init(success) {
                    _format = initData.format || dates.getDefaultTimeFormat();

                    var html = '<div class="input-group date">' +
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

                    _$control.on("dp.onChange", function (e: any) {
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
        } as UI.ITimePickerFactory;
    }
]);