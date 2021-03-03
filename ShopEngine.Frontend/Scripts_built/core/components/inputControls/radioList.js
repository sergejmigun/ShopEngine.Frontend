app.registerComponent('radioList', 'UI', [
    '$',
    'Promise',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Utils.objects',
    'Collections',
    function ($, promise, defaultInputValidationHandler, eventsInitializer, objects, collections) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper, _$inputWrapper, _$readOnlyLabel, _inputsData = [], _value, _validationHandler = defaultInputValidationHandler.init(control), _events = eventsInitializer.init(control, ['onChange', 'onRemove']);
                function invokeChange() {
                    _events.onChange.invoke();
                }
                function setDisabled() {
                    collections.foreach(_inputsData, function (inputData) {
                        inputData.inputElement.prop('disabled', initData.disabled);
                    });
                }
                function setReadOnly() {
                    if (initData.readOnly) {
                        _$readOnlyLabel.text(_value.text).show();
                        _$inputWrapper.hide();
                    }
                    else {
                        _$readOnlyLabel.text('').hide();
                        _$inputWrapper.show();
                    }
                }
                function setValue(newValue) {
                    if (objects.isNullOrUndefined(newValue) || newValue === _value.value) {
                        return;
                    }
                    collections.foreach(_inputsData, function (inputData) {
                        if (newValue === inputData.item.value) {
                            inputData.inputElement.prop('checked', true);
                            invokeChange();
                        }
                    });
                }
                function initItems() {
                    var radioId = objects.getGuid();
                    function initDataItem(item, $radioInput, isFirst) {
                        if (initData.value === item.value || isFirst) {
                            $radioInput.prop('checked', true);
                            _value = item;
                        }
                        $radioInput.change(function () {
                            if ($radioInput.prop('checked')) {
                                _value = item;
                                invokeChange();
                            }
                        });
                        _inputsData.push({
                            inputElement: $radioInput,
                            item: item
                        });
                    }
                    function initInlineMarkup() {
                        collections.foreach(initData.items, function (item, i) {
                            var $label = $('<label class="radio-inline" />'), $radioInput = $('<input type="radio" />').attr('name', radioId);
                            $label.append($radioInput).append(item.text);
                            _$inputWrapper.append($label);
                            initDataItem(item, $radioInput, i === 0);
                        });
                    }
                    function initVerticalMarkup() {
                        collections.foreach(initData.items, function (item, i) {
                            var $itemWrapper = $('<div class="radio" />'), $label = $('<label />'), $radioInput = $('<input type="radio" />').attr('name', radioId);
                            $label.append($radioInput).append(item.text);
                            $itemWrapper.append($label);
                            _$inputWrapper.append($itemWrapper);
                            initDataItem(item, $radioInput, i === 0);
                        });
                    }
                    if (initData.position === UI.RadioListPosition.Inline) {
                        initInlineMarkup();
                    }
                    else {
                        initVerticalMarkup();
                    }
                    if (objects.isNullOrUndefined(initData.value)) {
                        _inputsData[0].inputElement.prop('checked', true);
                        _value = _inputsData[0].item;
                    }
                }
                function init(success) {
                    _$wrapper = $('<div class="radio-list-wrapper" />');
                    container.setContent(_$wrapper);
                    _$readOnlyLabel = $('<span />').hide();
                    _$inputWrapper = $('<div />');
                    _$wrapper.append(_$inputWrapper).append(_$readOnlyLabel);
                    initItems();
                    setDisabled();
                    setReadOnly();
                    success(control);
                }
                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    }
                    else {
                        return objects.tryGet(_value, 'value');
                    }
                };
                control.disabled = function (disabled) {
                    if (disabled !== undefined) {
                        initData.disabled = disabled;
                        setDisabled();
                    }
                    else {
                        return initData.disabled;
                    }
                };
                control.readOnly = function (readOnly) {
                    if (readOnly !== undefined) {
                        initData.readOnly = readOnly;
                        setReadOnly();
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
