app.registerComponent('chainedSelectList', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Services.containerHelper',
    'Services.apiService',
    'Collections',
    'Utils.strings',
    'UI.singleSelectList',
    function ($: JQueryStatic,
        promise: IPromise,
        objects: Utils.IObjects,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        containerHelper: Services.IContainerHelper,
        apiService: Services.IApiService,
        collections: ICollections,
        strings: Utils.IStrings,
        singleSelectList: UI.ISingleSelectListFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IChainedSelectList,
                    _$wrapper: JQuery,
                    _$listWrapper: JQuery,
                    _$readOnlyTextWrapper: JQuery,
                    _definedValues,
                    _listsData = [],
                    _settingValue,
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove']);

                function appendListElement() {
                    var $listElement = $('<input type="hidden" />');
                    _$listWrapper.append($listElement.wrap('<div class="chained-list-item-wrapper" />').parent());

                    return $listElement;
                }

                function getListValueByIndex(valueIndex, source) {
                    if (!source) {
                        return;
                    }

                    if (source.length <= valueIndex) {
                        return;
                    }

                    return source[valueIndex];
                }

                function equals(listValue, value) {
                    if (!listValue && objects.isNullOrUndefined(value)) {
                        return true;
                    }

                    if (listValue) {
                        return listValue.value === value;
                    }

                    return false;
                }

                function setDisabled(disabled) {
                    collections.foreach(_listsData, function (listDataItem) {
                        listDataItem.instance.disabled(disabled);
                    });
                }

                function getValue() {
                    var value = [];

                    collections.foreach(_listsData, function (listDataItem) {
                        value.push(listDataItem.instance.value());
                    });

                    return value;
                }

                function getReadOnlyText() {
                    var texts = collections.from(getValue()).where(function (valueItem) {
                        return !objects.isNullOrUndefined(valueItem);
                    }).select(function (valueItem) {
                        return valueItem.text;
                    }).toArray();

                    if (!texts.length) {
                        return 'No value';
                    }

                    return strings.join(texts);
                }

                function setReadOnly(readOnly) {
                    if (readOnly) {
                        _$listWrapper.hide();
                        _$readOnlyTextWrapper = $('<p />');
                        _$readOnlyTextWrapper.text(getReadOnlyText());
                        _$wrapper.prepend(_$readOnlyTextWrapper);
                    } else {
                        if (_$readOnlyTextWrapper) {
                            _$readOnlyTextWrapper.remove();
                        }

                        _$listWrapper.show();
                    }

                    initData.readOnly = readOnly;
                }

                function getRelatedListItems(relatedListData, parentValue) {
                    return promise.create(function (success) {
                        if (relatedListData.getItems) {
                            success(relatedListData.getItems(parentValue));
                        }

                        if (relatedListData.itemsUrl) {
                            var urlArgName = relatedListData.urlArgName || 'parent',
                                url = strings.format('{0}?{1}={2}', relatedListData.itemsUrl, urlArgName, parentValue);

                            apiService.get(url).then(function (items) {
                                success(items);
                            });
                        }
                    });
                }

                function setListValue(listDataItem, value, index, completed) {
                    listDataItem.instance.value(value);

                    if (listDataItem.relatedListData) {
                        getRelatedListItems(listDataItem.relatedListData, value).then(function (relatedListItems) {
                            var relatedListDataItem = _listsData[index + 1],
                                relatedListValue = getListValueByIndex(index + 1, _definedValues);

                            relatedListDataItem.instance.setItems(relatedListItems);

                            if (relatedListValue) {
                                setListValue(relatedListDataItem, relatedListValue, index + 1, completed);
                            } else {
                                completed();
                            }
                        });
                    } else {
                        completed();
                    }
                }

                function setValue(value) {
                    if (_settingValue) {
                        return;
                    }

                    _settingValue = true;

                    if (value === null) {
                        collections.foreach(_listsData, function (listDataItem, index) {
                            if (index > 0) {
                                listDataItem.instance.setItems([]);
                            }

                            listDataItem.instance.value(null);
                        });

                        _settingValue = false;
                        _events.onChange.invoke();

                        return;
                    }

                    _definedValues = value;

                    collections.foreach(_listsData, function (listDataItem, index) {
                        var currentValue = listDataItem.instance.value();
                        var valueItem = (value && (value.length > index))
                            ? value[index]
                            : null;

                        if (!equals(currentValue, valueItem)) {

                            collections.from(_listsData).skip(index + 1).foreach(function (relatedListDataItem) {
                                relatedListDataItem.instance.setItems([]);
                            });

                            setListValue(listDataItem, valueItem, index, function () {
                                _settingValue = false;
                                _events.onChange.invoke();
                            });

                            return false;
                        }
                    });
                }

                function initSelectList($el: JQuery,
                    items: UI.ISelectListItem[],
                    url: string,
                    relatedListData: UI.IChainedListRelationsData,
                    index: number,
                    nonSelectedText:string) {
                    function initRelatedData(inst, parentValue) {
                        if (!objects.isNullOrUndefined(inst.value())) {
                            var $relatedEl = appendListElement(),
                                relatedItems,
                                relatedItemsUrl;

                            if (relatedListData.getItems) {
                                relatedItems = relatedListData.getItems(parentValue);
                            }

                            if (relatedListData.itemsUrl) {
                                relatedItemsUrl = relatedListData.itemsUrl + '?parent=' + parentValue;
                            }

                            return initSelectList(
                                $relatedEl,
                                relatedItems,
                                relatedItemsUrl,
                                relatedListData.relatedListData,
                                index + 1,
                                relatedListData.nonSelectedText
                            );
                        }

                        return initSelectList(appendListElement(),
                                [],
                                null,
                                relatedListData.relatedListData,
                                index + 1,
                                relatedListData.nonSelectedText);
                    }

                    return promise.create(function (success) {
                        var value = getListValueByIndex(index, initData.value),
                            listDataItem = {} as any;

                        singleSelectList.init(containerHelper.replace($el, container.ready()), {
                            nullable: true,
                            items: items,
                            itemsUrl: url,
                            fullWidth: true,
                            value: value,
                            nonSelectedText: nonSelectedText,
                            disabled: true,
                            name: index.toString()
                        }).then(function (inst) {
                            _listsData[index] = listDataItem;
                            listDataItem.instance = inst;
                            listDataItem.relatedListData = relatedListData;

                            inst.onChange(function () {
                                if (_settingValue) {
                                    return;
                                }
                                var changedValue = inst.value();
                                _settingValue = true;
                                collections.removeRange(_definedValues, index + 1);

                                collections.from(_listsData).skip(index + 1).foreach(function (relatedListDataItem) {
                                    relatedListDataItem.instance.setItems([]);
                                });

                                if (changedValue && listDataItem.relatedListData) {
                                    getRelatedListItems(listDataItem.relatedListData, changedValue).then(function (relatedListItems) {
                                        var relatedListDataItem = _listsData[index + 1];
                                        relatedListDataItem.instance.setItems(relatedListItems);
                                        _events.onChange.invoke();
                                        _settingValue = false;
                                    });
                                } else {
                                    _events.onChange.invoke();
                                    _settingValue = false;
                                }
                            });

                            if (relatedListData) {
                                initRelatedData(inst, value).then(function () {
                                    success(inst);
                                });
                            } else {
                                success(inst);
                            }
                        });
                    });
                }

                function init(success) {
                    _$wrapper = $('<div />');
                    _$listWrapper = $('<div />');
                    _$wrapper.append(_$listWrapper);

                    // init basics
                    container.setContent(_$wrapper);

                    // custom logic
                    if (initData.readOnly) {
                        _$listWrapper.hide();
                    }

                    var initSelectListPromise = initSelectList(
                        appendListElement(),
                        initData.items,
                        initData.itemsUrl,
                        initData.relatedListData,
                        0,
                        initData.nonSelectedText
                    );

                    initSelectListPromise.then(function () {
                        success(control);

                        if (initData.readOnly) {
                            setReadOnly(true);
                        }

                        if (!initData.disabled) {
                            setDisabled(false);
                        }
                    });
                }

                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    } else {
                        return getValue();
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
        } as UI.IChainedSelectListFactory;
    }
]);