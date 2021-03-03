app.registerComponent('multiSelectList', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Collections',
    'Utils.strings',
    'Services.eventsInitializer',
    'Services.defaultInputValidationHandler',
    'Services.apiService',
    function ($: JQueryStatic,
        promise: IPromise,
        objects: Utils.IObjects,
        collections: ICollections,
        strings: Utils.IStrings,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        apiService: Services.IApiService) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IMultiSelectList,
                    _$control: JQuery,
                    _$wrapper: JQuery,
                    _valueData = [],
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove']);

                function findValueItem(value) {
                    return collections.first(initData.items, function (item) {
                        return objects.stringsEquals(item.value, value);
                    });
                }

                function setValue(value) {
                    if (!value || !value.length) {
                        if (_valueData.length) {
                            collections.removeAll(_valueData);
                            _$control.val(null);
                            _$control['multiselect']('deselectAll', false);
                            _$control['multiselect']("refresh");
                            _events.onChange.invoke(_valueData);
                        }
                        return;
                    }

                    var changed = false,
                        intersection = collections.intersect(value, _valueData, function (item1, item2) {
                            return objects.stringsEquals(item1, item2.value);
                        });

                    collections.foreach(intersection.first, function (itemValue) {
                        var itemObj = findValueItem(itemValue);

                        if (itemObj) {
                            _valueData.push(itemObj);
                            _$control['multiselect']('select', itemValue);
                            changed = true;
                        }
                    });

                    collections.foreach(intersection.second, function (itemObj) {
                        collections.remove(_valueData, itemObj);
                        _$control['multiselect']('deselect', itemObj.value);
                        changed = true;
                    });

                    if (changed) {
                        _events.onChange.invoke(_valueData);
                    }
                }

                function getValueTexts() {
                    return collections.select(_valueData, function (valueItem) {
                        return valueItem.text;
                    }).toArray();
                }

                function setReadOnlyText() {
                    var text;

                    if (!_valueData.length) {
                        text = 'No value';
                    } else {
                        text = strings.join(getValueTexts());
                    }

                    _$control.text(text);
                }

                function setDisabled(disabled) {
                    if (!initData.readOnly) {
                        if (disabled) {
                            _$control['multiselect']('disable');
                        } else {
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
                    }

                    _$control.append($option);
                }

                function initSelectListItems() {
                    collections.foreach(initData.items, function (item) {
                        appendOption(item, collections.contains(_valueData, item));
                    });

                    if (!initData.nullable && !_valueData.length) {
                        _$control.find('option:first').attr('selected', 'selected');
                    }
                }

                function initSelectList() {
                    _$control = $('<select class="form-control" multiple="multiple"></select>');
                    _$wrapper.append(_$control);

                    initSelectListItems();

                    var multiselectOptions = {
                        onChange: function () {
                            var values = _$control.val() as any;
                            var newValue = [];

                            if (values) {
                                collections.foreach(values, function (value) {
                                    var valueItem = findValueItem(value);
                                    newValue.push(valueItem);
                                });
                            }

                            _valueData = newValue;
                            _events.onChange.invoke(_valueData);
                        },
                        disableIfEmpty: true,
                        nonSelectedText: initData.nonSelectedText
                    } as any;

                    if (initData.fullWidth) {
                        multiselectOptions.buttonWidth = '100%';
                    }

                    if (initData.disabled) {
                        _$control.prop('disabled', true);
                        initData.disabled = true;
                    }

                    _$control['multiselect'](multiselectOptions);
                    _$wrapper.find('button.multiselect').addClass('form-control-button');
                }

                function initReadOnly() {
                    _$control = $('<span></span>');
                    _$wrapper.append(_$control);
                    setReadOnlyText();
                }

                function setReadOnly(readOnly) {
                    if (readOnly) {
                        if (initData.readOnly) {
                            return;
                        }

                        _$control['multiselect']('destroy').remove();
                        initData.readOnly = true;
                        initReadOnly();
                    } else {
                        if (!initData.readOnly) {
                            return;
                        }

                        _$control.remove();
                        initData.readOnly = false;
                        initSelectList();
                    }
                }

                function initValue() {
                    if (!initData.value) {
                        return;
                    }

                    collections.foreach(initData.items, function (item) {
                        if (collections.contains(initData.value, item.value)) {
                            _valueData.push(item);
                        }
                    });
                }

                function initInner(success) {
                    initValue();

                    if (initData.nullable !== false) {
                        initData.nullable = true;
                    }

                    if (initData.readOnly) {
                        initReadOnly();
                    } else {
                        initSelectList();
                    }
                    success(control);
                }

                function init(success) {
                    _$wrapper = $('<div />');

                    container.setContent(_$wrapper);

                    if (initData.items) {
                        initInner(success);
                    } else if (initData.itemsUrl) {
                        apiService.get(initData.itemsUrl).then(function (items: UI.ISelectListItem[]) {
                            initData.items = objects.clone(items);
                            initInner(success);
                        });
                    }
                }

                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    } else {
                        return collections.from(_valueData).select(function (valueItem) {
                            return valueItem.value;
                        }).toArray();
                    }
                };

                control.setItems = function (items) {
                    var valueLength = _valueData.length;
                    initData.items = objects.clone(items);
                    collections.removeAll(_valueData);
                    initValue();

                    if (valueLength !== _valueData.length) {
                        _events.onChange.invoke();
                    }

                    if (!initData.readOnly) {
                        _$control.find('option').remove();
                        initSelectListItems();
                        _$control['multiselect']('rebuild');
                    } else {
                        setReadOnlyText();
                    }
                };

                control.disabled = function (disabled) {
                    if (disabled !== undefined) {
                        setDisabled(disabled);
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
        } as UI.IMultiSelectListFactory;
    }
]);