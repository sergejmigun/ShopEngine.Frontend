app.registerComponent('dateTimeRangeBox', 'UI', [
    '$',
    'Resources.UICore',
    'Promise',
    'Utils.objects',
    'Utils.dates',
    'Utils.strings',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    function ($, resources, promise, objects, dates, strings, defaultInputValidationHandler, eventsInitializer) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper, _$controlWrapper, _$readOnlyLabel, _$control, _$input, _value = null, _format, _validationHandler = defaultInputValidationHandler.init(control), _events = eventsInitializer.init(control, ['onChange', 'onRemove']);
                function getValueText() {
                    return strings.format('{0} - {1}', dates.format(_value.from, _format), dates.format(_value.to, _format));
                }
                function setUiDisabled() {
                    _$control.find('input').prop('disabled', initData.disabled);
                }
                function setReadOnlyText() {
                    var value = control.value();
                    if (!value) {
                        _$readOnlyLabel.text('No value');
                    }
                    else {
                        _$readOnlyLabel.text(getValueText());
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
                    }
                    else {
                        _$controlWrapper.show();
                        _$readOnlyLabel.hide();
                        initData.readOnly = false;
                    }
                }
                function validate(value) {
                    if (!value && !initData.nullable) {
                        return false;
                    }
                    if (initData.nullable && value === null) {
                        return true;
                    }
                    if (!objects.isDate(value.from) || !objects.isDate(value.to)) {
                        return false;
                    }
                    if (value.to < value.from) {
                        return false;
                    }
                    if (initData.max && initData.max < value.to) {
                        return false;
                    }
                    if (initData.min && initData.min > value.from) {
                        return false;
                    }
                    return true;
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
                function setValue(value) {
                    if (!areEqual(value, _value)) {
                        _value = value;
                        invokeChange();
                        return true;
                    }
                }
                function setUiValue() {
                    var valueText = _value
                        ? getValueText()
                        : '';
                    _$input.val(valueText);
                }
                function validateAndSetUiValue(value) {
                    if (validate(value) && setValue(value)) {
                        if (value) {
                            _$input.data('daterangepicker').setStartDate(value.from);
                            _$input.data('daterangepicker').setEndDate(value.to);
                        }
                        else {
                            _$input.data('daterangepicker').setEndDate('');
                            _$input.data('daterangepicker').setEndDate('');
                        }
                        setUiValue();
                    }
                }
                function init(success) {
                    var html = '<div class="input-group date">' +
                        '<input type="text" class="form-control" />' +
                        '<span class="input-group-addon">' +
                        '<span class="glyphicon glyphicon-calendar"></span>' +
                        '</span></div>';
                    // init jquery control object
                    _$wrapper = $('<div />');
                    _$controlWrapper = $('<div />');
                    _$control = $(html);
                    _$input = _$control.find('input');
                    _$controlWrapper.append(_$control);
                    _$readOnlyLabel = $('<span />').hide();
                    _$wrapper.append(_$controlWrapper).append(_$readOnlyLabel);
                    _$control.find('.input-group-addon').click(function () {
                        if (initData.disabled) {
                            return;
                        }
                        _$input.click();
                    });
                    container.setContent(_$wrapper);
                    var daterangepickerOptions = {
                        locale: {
                            applyLabel: resources.apply,
                            cancelLabel: resources.cancel,
                            customRangeLabel: resources.customRange
                        }
                    };
                    objects.map(initData, daterangepickerOptions, {
                        includeTime: 'timePicker'
                    });
                    if (initData.timePicker) {
                        _format = initData.format || dates.getDefaultDateTimeFormat();
                    }
                    else {
                        _format = initData.format || dates.getDefaultDateFormat();
                    }
                    daterangepickerOptions.locale.format = _format;
                    daterangepickerOptions.autoUpdateInput = false;
                    if (initData.nullable) {
                        _$input.on('cancel.daterangepicker', function () {
                            _$input.val('');
                            setValue(null);
                            _$input.data('daterangepicker').setEndDate('');
                            _$input.data('daterangepicker').setEndDate('');
                        });
                    }
                    _$input['daterangepicker'](daterangepickerOptions);
                    _$input.on('apply.daterangepicker', function (data, picker) {
                        var valueIsSet = setValue({
                            from: picker.startDate.toDate(),
                            to: picker.endDate.toDate()
                        });
                        if (valueIsSet) {
                            setUiValue();
                        }
                        return data;
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
                control.value = function (value) {
                    if (value !== undefined) {
                        validateAndSetUiValue(value);
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
                    _$control.remove();
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
