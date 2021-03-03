app.registerComponent('singleSelectList', 'UI', [
    '$',
    'Promise',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Services.apiService',
    'Collections',
    'Utils.objects',
    'Resources.UICore',
    'Shared',
    function ($, promise, defaultInputValidationHandler, eventsInitializer, apiService, collections, objects, resources, shared) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$control, _$wrapper, _wasChanged, _valueData, _validationHandler = defaultInputValidationHandler.init(control), _events = eventsInitializer.init(control, ['onChange', 'onRemove']);
                function findValueItem(value) {
                    return collections.first(initData.items, function (item) {
                        return objects.stringsEquals(item.value, value);
                    });
                }
                function setControlValue(valueItem, value) {
                    _valueData = valueItem;
                    _$control.val(value);
                    _$control['multiselect']('refresh');
                    _events.onChange.invoke();
                }
                function setListValue(value) {
                    if (initData.nullable && !value && _valueData) {
                        setControlValue(null, null);
                    }
                    var valueItem = findValueItem(value);
                    if (valueItem && valueItem !== _valueData) {
                        setControlValue(valueItem, valueItem.value);
                    }
                }
                function setReadOnlyText() {
                    var text;
                    if (!_valueData) {
                        text = resources.noValue;
                    }
                    else {
                        text = _valueData.text;
                    }
                    _$control.text(text);
                }
                function setValue(value) {
                    if (initData.readOnly) {
                        setReadOnlyText();
                    }
                    else {
                        setListValue(value);
                    }
                }
                function setDisabled(disabled) {
                    if (!initData.readOnly) {
                        if (disabled) {
                            _$control['multiselect']('disable');
                        }
                        else {
                            if (initData.items.length) {
                                _$control['multiselect']('enable');
                            }
                        }
                    }
                    initData.disabled = disabled;
                }
                function appendOption(item, selected) {
                    var $option = $('<option />');
                    $option.text(item.text || item.value);
                    $option.val(item.value);
                    if (selected) {
                        $option.attr('selected', 'selected');
                        _valueData = item;
                    }
                    _$control.append($option);
                }
                function initSelectListItems() {
                    collections.foreach(initData.items, function (item) {
                        appendOption(item, item === _valueData);
                    });
                    if (!initData.nullable && !_valueData) {
                        _$control.find('option:first').attr('selected', 'selected');
                    }
                }
                function initNullable() {
                    if (initData.nullable) {
                        if (!_valueData) {
                            _valueData = null;
                        }
                        _$control.next().find('.multiselect-container input').click(function () {
                            shared.window.setTimeout(function () {
                                if (!_wasChanged) {
                                    setValue(null);
                                    $('body').click();
                                }
                                else {
                                    _wasChanged = false;
                                }
                            }, 20);
                        });
                    }
                }
                function initReadOnly() {
                    _$control = $('<span class="form-property" />');
                    _$wrapper.append(_$control);
                    setReadOnlyText();
                }
                function initSelectList() {
                    _$control = $('<select class="form-control" />');
                    _$wrapper.append(_$control);
                    if (initData.nullable) {
                        _$control.attr('size', '2');
                    }
                    initSelectListItems();
                    // custom logic
                    var multiselectOptions = {
                        onChange: function () {
                            var value = _$control.val();
                            if (!_valueData || !objects.stringsEquals(value, _valueData.value)) {
                                var valueItem = findValueItem(value);
                                _valueData = valueItem;
                                _events.onChange.invoke();
                                _wasChanged = true;
                            }
                        },
                        disableIfEmpty: true,
                        nonSelectedText: initData.nonSelectedText || resources.nonSelected
                    };
                    if (initData.fullWidth) {
                        multiselectOptions.buttonWidth = '100%';
                    }
                    if (initData.disabled) {
                        _$control.prop('disabled', true);
                        initData.disabled = true;
                    }
                    _$control['multiselect'](multiselectOptions);
                    _$wrapper.find('button.multiselect').addClass('form-control-button');
                    initNullable();
                }
                function setReadOnly(readOnly) {
                    if (readOnly) {
                        if (initData.readOnly) {
                            return;
                        }
                        _$control['multiselect']('destroy').remove();
                        initData.readOnly = true;
                        initReadOnly();
                    }
                    else {
                        if (!initData.readOnly) {
                            return;
                        }
                        _$control.remove();
                        initData.readOnly = false;
                        initSelectList();
                    }
                }
                function initInner(success) {
                    _valueData = findValueItem(initData.value);
                    if (objects.isNullOrUndefined(_valueData) && !initData.nullable) {
                        _valueData = initData.items[0];
                    }
                    if (initData.readOnly) {
                        initReadOnly();
                    }
                    else {
                        initSelectList();
                    }
                    success(control);
                }
                function init(success) {
                    _$wrapper = $('<div />');
                    container.setContent(_$wrapper);
                    if (initData.items) {
                        initInner(success);
                    }
                    else if (initData.itemsUrl) {
                        apiService.get(initData.itemsUrl).then(function (items) {
                            initData.items = items;
                            initInner(success);
                        });
                    }
                }
                // public
                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    }
                    else {
                        return objects.tryGet(_valueData, 'value');
                    }
                };
                control.getSelectedItem = function () {
                    return objects.clone(_valueData);
                };
                control.setItems = function (items) {
                    initData.items = objects.clone(items);
                    _valueData = null;
                    _events.onChange.invoke();
                    if (!initData.readOnly) {
                        _$control.find('option').remove();
                        initSelectListItems();
                        _$control['multiselect']('rebuild');
                        initNullable();
                    }
                    else {
                        setReadOnlyText();
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
                    _$control['multiselect']('destroy');
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
