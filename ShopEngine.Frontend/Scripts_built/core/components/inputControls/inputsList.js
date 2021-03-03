app.registerComponent('inputsList', 'UI', [
    'Promise',
    'Utils.objects',
    'Collections',
    'Services.eventsInitializer',
    'Services.inputsListValidationHandler',
    'UI.buttons',
    'Services.inputsListUiManager',
    function (promise, objects, collections, eventsInitializer, inputsListValidationHandler, buttons, uiContext) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _ui, _addButton, _initData = objects.clone(initData), _validationHandler, _controlContext, _disabled, _readOnly, _eventNames = ['onChange', 'onRemove', 'orderChanged', 'controlRemoved', 'onSelectionChange'], _events = eventsInitializer.init(control, _eventNames);
                function invokeChange() {
                    _events.onChange.invoke();
                }
                function setDisabled(disabled) {
                    _disabled = disabled;
                    collections.foreach(_controlContext.getControlsData(), function (controlData) {
                        controlData.control.disabled(disabled);
                        controlData.setDisabled(disabled);
                    });
                    if (_addButton) {
                        _addButton.disable();
                    }
                }
                function setReadOnly(readOnly) {
                    _readOnly = readOnly;
                    collections.foreach(_controlContext.getControlsData(), function (controlData) {
                        controlData.control.readOnly(readOnly);
                    });
                    _ui.setReadOnly();
                    if (_addButton) {
                        _addButton.hide();
                    }
                }
                function initHeader() {
                    if (!initData.header) {
                        return;
                    }
                    _ui.initHeader(initData.header);
                }
                function initSortable() {
                    if (!_initData.sortable) {
                        return;
                    }
                    _ui.initSortable(function (oldIndex, newIndex) {
                        _controlContext.sortItems(oldIndex, newIndex);
                    });
                }
                function initAddButton() {
                    if (_initData.canAdd === false) {
                        return;
                    }
                    _addButton = _ui.initAddButton(_initData.addButtonText, _controlContext.addNewItem);
                }
                function setControlValues(controlsData, values, initItemFunc) {
                    var promises = [];
                    if (!values) {
                        values = [];
                    }
                    collections.foreach(values, function (valueItem, index) {
                        if (controlsData.length > index) {
                            controlsData[index].setValue(valueItem);
                        }
                        else {
                            promises.push(initItemFunc(valueItem));
                        }
                    });
                    if (controlsData.length > values.length) {
                        collections.repeat(controlsData.length - values.length, function () {
                            var index = values.length;
                            _controlContext.removeItem(controlsData[index]);
                        });
                    }
                    return promise.all(promises);
                }
                function initControlData(valueItem, source, isNewItem) {
                    function getActionsData(controlData, definedActionsData) {
                        var actionsData = [];
                        collections.safeForeach(definedActionsData, function (actionData) {
                            var btnData = objects.clone(actionData), btnAction = btnData.action;
                            btnData.action = function () {
                                btnAction(controlData.getValue());
                            };
                            actionsData.push(btnData);
                        });
                        if (_initData.canDelete !== false) {
                            var deleteBtnData = buttons.getData('remove');
                            deleteBtnData.action = function () {
                                _controlContext.removeItem(controlData);
                                invokeChange();
                            };
                            actionsData.push(deleteBtnData);
                        }
                        return actionsData;
                    }
                    var controlData = {
                        source: source
                    };
                    var controlValue = valueItem;
                    if (initData.complexValue) {
                        if (valueItem) {
                            controlData.valueData = valueItem.data;
                            controlValue = valueItem.value;
                        }
                    }
                    var actionsData = getActionsData(controlData, isNewItem
                        ? _initData.newItemsActionsData
                        : _initData.actionsData);
                    var controlUiData = _ui.renderControlRow(_initData.controlInitializer, controlValue, actionsData);
                    controlData.container = controlUiData.container;
                    controlData.remove = function () {
                        _events.controlRemoved.invoke(controlData.control);
                        controlData.control.remove();
                        controlData.container.remove();
                    };
                    if (controlUiData.checkBoxPromise) {
                        controlUiData.checkBoxPromise.then(function (checkBox) {
                            controlData.checkBox = checkBox;
                            checkBox.onChange(function () {
                                _events.onSelectionChange.invoke();
                            });
                        });
                    }
                    controlData.controlPromise = controlUiData.controlPromise;
                    controlData.controlPromise.then(function (inst) {
                        controlData.control = inst;
                        inst.onChange(function () {
                            invokeChange();
                        });
                        return inst;
                    });
                    controlData.setValue = function (value) {
                        if (initData.complexValue) {
                            if (value) {
                                controlData.valueData = value.data;
                                controlData.control.value(value.value);
                            }
                            else {
                                controlData.control.value(null);
                            }
                        }
                        else {
                            controlData.control.value(value);
                        }
                        if (isNewItem) {
                            isNewItem = false;
                            controlUiData.updateControlActions(getActionsData(controlData, _initData.actionsData));
                        }
                    };
                    controlData.getValue = function () {
                        if (initData.complexValue) {
                            return {
                                data: objects.clone(controlData.valueData),
                                value: controlData.control.value()
                            };
                        }
                        return controlData.control.value();
                    };
                    return controlData;
                }
                function initGroupedContext() {
                    var context = {}, contextData = [], contextDataDict = {};
                    function getControlDataArray(index, inclusive) {
                        var groupMaxIndex = -1, data;
                        collections.foreach(contextData, function (group) {
                            if (data) {
                                return;
                            }
                            groupMaxIndex += group.controlsData.length + 1;
                            var indexToCompare = inclusive
                                ? index - 1
                                : index;
                            if (groupMaxIndex >= indexToCompare) {
                                data = {
                                    index: (group.controlsData.length - 1) - (groupMaxIndex - index),
                                    array: group.controlsData,
                                    group: group
                                };
                            }
                        });
                        return data;
                    }
                    function renderGroupRow(groupData) {
                        function addItem(itemContainer, addFirstFunc) {
                            if (groupData.controlsData.length) {
                                collections.last(groupData.controlsData).container.after(itemContainer);
                            }
                            else {
                                addFirstFunc(itemContainer);
                            }
                        }
                        var renderGroupResult = _ui.renderGroupRow(groupData, contextData.length === 0);
                        groupData.addItemContainer = function (itemContainer) {
                            addItem(itemContainer, function () {
                                renderGroupResult.appendItem(itemContainer);
                            });
                        };
                        groupData.uiData = renderGroupResult;
                    }
                    function addItem(valueItem, groupData, isNewItem) {
                        var controlData = initControlData(valueItem, groupData.controlsData, isNewItem);
                        _ui.appendControlRowToGroup(controlData);
                        groupData.addItemContainer(controlData.container);
                        groupData.controlsData.push(controlData);
                        controlData.group = groupData;
                        return controlData.controlPromise;
                    }
                    function initGroupData(valueGroup) {
                        var groupData = {
                            groupKey: valueGroup.groupKey,
                            title: valueGroup.title,
                            data: valueGroup.data,
                            controlsData: [],
                            expanded: true
                        };
                        contextDataDict[valueGroup.groupKey] = groupData;
                        renderGroupRow(groupData);
                        contextData.push(groupData);
                        return groupData;
                    }
                    function removeGroup(groupData) {
                        groupData.uiData.remove();
                        delete contextDataDict[groupData.groupKey];
                        collections.remove(contextData, groupData);
                        collections.foreach(groupData.controlsData, function (controlData) {
                            controlData.remove();
                        });
                    }
                    function updateGroupPosition(groupData, index) {
                        if (contextData[index] === groupData) {
                            return;
                        }
                        var oldIndex = collections.indexOf(contextData, groupData);
                        _ui.prependGroupRow(contextData[index], groupData, index === 0);
                        objects.moveArrayItem(contextData, oldIndex, index);
                    }
                    context.setValue = function (value) {
                        var toBeRemovedGroups = collections.from(contextData).where(function (groupData) {
                            return !collections.from(value).any(function (valueGroup) {
                                return valueGroup.groupKey === groupData.groupKey;
                            });
                        }).toArray();
                        collections.foreach(toBeRemovedGroups, function (groupData) {
                            removeGroup(groupData);
                        });
                        var promises = [];
                        collections.foreach(value, function (valueGroup, index) {
                            var groupData = contextDataDict[valueGroup.groupKey];
                            if (!groupData) {
                                groupData = initGroupData(valueGroup);
                            }
                            else {
                                groupData.data = valueGroup.data;
                                updateGroupPosition(groupData, index);
                                if (groupData.title !== valueGroup.title) {
                                    groupData.title = valueGroup.title;
                                    groupData.uiData.updateTitle(valueGroup.title);
                                }
                            }
                            setControlValues(groupData.controlsData, valueGroup.items, function (valueItem) {
                                promises.push(addItem(valueItem, groupData, false));
                            });
                        });
                        if (context.hasNoData()) {
                            _ui.showNoDataMessage();
                        }
                        return promise.all(promises);
                    };
                    context.getValue = function () {
                        return collections.from(contextData).select(function (groupData) {
                            var groupValue = {
                                groupKey: groupData.groupKey,
                                data: groupData.data,
                                items: undefined
                            };
                            groupValue.items = collections.from(groupData.controlsData).select(function (controlData) {
                                return controlData.getValue();
                            }).toArray();
                            return groupValue;
                        }).toArray();
                    };
                    context.addNewItem = function () {
                        var defaultGroup = collections.from(contextData).where(function (groupData) {
                            return groupData.groupKey === _initData.defaultGroupData.groupKey;
                        }).first();
                        if (!defaultGroup) {
                            defaultGroup = initGroupData(_initData.defaultGroupData);
                        }
                        addItem(null, defaultGroup, true);
                    };
                    context.removeItem = function (controlData) {
                        controlData.remove();
                        collections.remove(controlData.group.controlsData, controlData);
                        if (context.hasNoData()) {
                            _ui.showNoDataMessage();
                        }
                    };
                    context.getControlsData = function () {
                        var controlsData = [];
                        collections.foreach(contextData, function (groupData) {
                            collections.copy(groupData.controlsData, controlsData);
                        });
                        return controlsData;
                    };
                    context.getControl = function (index, groupName) {
                        return contextDataDict[groupName].controlsData[index];
                    };
                    context.getSelectedIndexes = function () {
                        var groupIndexes = [];
                        collections.foreach(contextData, function (groupData) {
                            var indexes = [];
                            collections.foreach(groupData.controlsData, function (controlData, index) {
                                if (controlData.isSelected) {
                                    indexes.push(index);
                                }
                            });
                            if (!objects.isEmptyArray(indexes)) {
                                groupIndexes.push({
                                    groupkey: groupData.groupKey,
                                    indexes: indexes
                                });
                            }
                        });
                        return groupIndexes;
                    };
                    context.sortItems = function (oldIndex, newIndex) {
                        if (oldIndex !== newIndex) {
                            oldIndex += 1;
                            newIndex += 1;
                            var oldArrayData = getControlDataArray(oldIndex), controlData = oldArrayData.array[oldArrayData.index];
                            collections.removeByIndex(oldArrayData.array, oldArrayData.index);
                            var newArrayData = getControlDataArray(newIndex, true);
                            if (newArrayData.group) {
                                newArrayData.group.expanded = true;
                            }
                            collections.insert(newArrayData.array, newArrayData.index, controlData);
                            _events.orderChanged.invoke();
                            invokeChange();
                        }
                    };
                    context.hasNoData = function () {
                        var noData = !collections.from(contextData).any(function (groupItem) {
                            return !objects.isEmptyArray(groupItem.controlsData);
                        });
                        return noData;
                    };
                    return context;
                }
                function initSimpleContext() {
                    var context = {}, controlsData = [];
                    function addItem(valueItem, isNewItem) {
                        var controlData = initControlData(valueItem, controlsData, isNewItem === true);
                        _ui.appendControlRow(controlData);
                        controlsData.push(controlData);
                        return controlData.controlPromise;
                    }
                    context.setValue = function (value) {
                        var promises = setControlValues(controlsData, value, addItem);
                        if (context.hasNoData()) {
                            _ui.showNoDataMessage();
                        }
                        return promises;
                    };
                    context.getValue = function () {
                        return collections.from(controlsData).select(function (controlData) {
                            return controlData.getValue();
                        }).toArray();
                    };
                    context.addNewItem = function () {
                        addItem(null, true);
                    };
                    context.removeItem = function (controlData) {
                        controlData.remove();
                        collections.remove(controlsData, controlData);
                        if (context.hasNoData()) {
                            _ui.showNoDataMessage();
                        }
                    };
                    context.getControlsData = function () {
                        return controlsData;
                    };
                    context.getControl = function (index) {
                        return controlsData[index].control;
                    };
                    context.getSelectedIndexes = function () {
                        var indexes = [];
                        collections.foreach(controlsData, function (controlData, index) {
                            if (controlData.isSelected) {
                                indexes.push(index);
                            }
                        });
                        return indexes;
                    };
                    context.sortItems = function (oldIndex, newIndex) {
                        if (oldIndex !== newIndex) {
                            objects.moveArrayItem(controlsData, oldIndex, newIndex);
                            _events.orderChanged.invoke();
                            invokeChange();
                        }
                    };
                    context.hasNoData = function () {
                        return objects.isEmptyArray(controlsData);
                    };
                    return context;
                }
                function init(success) {
                    var uiContextData = _initData;
                    uiContextData.containerReady = container.ready();
                    uiContext.init(uiContextData).then(function (inst) {
                        _ui = inst;
                        container.setContent(_ui.container);
                        _controlContext = _initData.hasGroups
                            ? initGroupedContext()
                            : initSimpleContext();
                        initAddButton();
                        initHeader();
                        initSortable();
                        _controlContext.setValue(_initData.value).then(function () {
                            if (initData.readOnly) {
                                setReadOnly(true);
                            }
                            if (initData.disabled) {
                                setDisabled(true);
                            }
                            _validationHandler = inputsListValidationHandler.init(control, _ui.container.find('.validationContainer'));
                            success(control);
                        });
                    });
                }
                control.value = function (value) {
                    if (value !== undefined) {
                        _controlContext.setValue(value);
                    }
                    else {
                        return _controlContext.getValue();
                    }
                };
                control.disabled = function (disabled) {
                    if (disabled !== undefined) {
                        setDisabled(disabled);
                    }
                    else {
                        return _disabled;
                    }
                };
                control.readOnly = function (readOnly) {
                    if (readOnly !== undefined) {
                        setReadOnly(readOnly);
                    }
                    else {
                        return _readOnly;
                    }
                };
                control.getControl = function (index, groupKey) {
                    return _controlContext.getControl(index, groupKey);
                };
                control.getAllControls = function () {
                    return collections.from(_controlContext.getControlsData()).select(function (controlData) {
                        return controlData.control;
                    }).toArray();
                };
                control.getSelectedIndexes = function () {
                    if (!initData.selectable) {
                        return;
                    }
                    return _controlContext.getSelectedIndexes();
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
                    _controlContext.remove();
                    _events.onRemove.invoke();
                };
                control.getJQueryObject = function () {
                    return _ui.container;
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);
