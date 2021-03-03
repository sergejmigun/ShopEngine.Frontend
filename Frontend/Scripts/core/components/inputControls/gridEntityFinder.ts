app.registerComponent('gridEntityFinder', 'UI', [
    '$',
    'Promise',
    'Resources.UICore',
    'Utils.objects',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Services.containerHelper',
    'UI.grid',
    'UI.finder',
    'UI.buttons',
    'Collections',
    function ($: JQueryStatic,
        promise: IPromise,
        resources: Resources.UICore,
        objects: Utils.IObjects,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        containerHelper: Services.IContainerHelper,
        grid: UI.IGridFactory,
        finder: UI.IFinderFactory,
        buttons: UI.IButtonsFactory,
        collections: ICollections) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IGridEntityFinder,
                    _$wrapper = $('<div class="grid-entity-finder" />'),
                    _$finderContainer: JQuery,
                    _$gridContainer: JQuery,
                    _columnsMap = {},
                    _grid: UI.IGrid,
                    _finder: UI.IFinder,
                    _readOnly: boolean,
                    _disabled: boolean,
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove']);

                function setReadOnly(readOnly) {
                    _readOnly = readOnly;

                    if (readOnly) {
                        _$finderContainer.hide();
                        collections.from(_grid.getColumns()).where(function (column) {
                            return column.name === 'Actions';
                        }).foreach(function (column) {
                            column.hide();
                        });
                    } else {
                        _$finderContainer.show();
                        collections.from(_grid.getColumns()).where(function (column) {
                            return column.name === 'Actions';
                        }).foreach(function (column) {
                            column.show();
                        });
                    }
                }

                function setDisabled(disabled) {
                    _disabled = disabled;
                    _finder.disabled(disabled);
                }

                function initEmptyCells(entity) {
                    var cells = [];
                    collections.foreach(_columnsMap, function (value, name) {
                        app.ignoreParams(value);

                        var customCell = collections.from(initData.customCells || []).first(function (cc) {
                            return cc.columName === name;
                        });

                        if (customCell) {
                            customCell.cellData.data = entity;
                            cells.push(customCell.cellData);
                        }
                        else {
                            cells.push({});
                        }
                    });

                    return cells;
                }

                function appendEntity(entity) {
                    var row = {
                        data: entity,
                        cells: initEmptyCells(entity)
                    };

                    collections.foreach(entity, function (value, name) {
                        if (!_columnsMap.hasOwnProperty(name)) {
                            return;
                        }

                        row.cells[_columnsMap[name]].text = value;
                    });

                    row.cells.push({
                        data: entity,
                        render: function (data, append) {
                            var $wrapper = $('<div class="text-center" />');

                            buttons.remove({
                                text: 'Delete',
                                size: UI.ButtonSize.XSmall,
                                action: function () {
                                    _grid.removeRows(function (rowData) {
                                        return rowData === data;
                                    });

                                    if (!_grid.getRows().length) {
                                        _$gridContainer.hide();
                                    }

                                    _events.onChange.invoke();
                                }
                            }, containerHelper.appendTo($wrapper, container.ready()));

                            append($wrapper);
                        }
                    });

                    _$gridContainer.show();

                    return _grid.appendRow(row);
                }

                function clearGrid() {
                    _grid.removeRows(function () {
                        return true;
                    });
                }

                function setValue(ids) {
                    if (objects.isEmptyArray(ids)) {
                        clearGrid();

                        return promise.empty();
                    }

                    return promise.create(function (success) {
                        initData.loadByIds(ids).then(function (entities) {
                            var promises = [];

                            collections.foreach(entities, function (entity) {
                                promises.push(appendEntity(entity));
                            });

                            promise.all(promises).then(function () {
                                success();
                            });
                        });
                    });
                }

                function getValue() {
                    return collections.from(_grid.getRows()).select(function (row) {
                        return row.data[initData.valuePropName];
                    }).toArray();
                }

                function initFinder() {
                    return finder.init(containerHelper.appendTo(_$finderContainer, container.ready()), {
                        url: initData.findUrl,
                        placeholder: initData.finderPlaceholder,
                        minLength: initData.minLength,
                        textPropName: initData.textPropName,
                        valuePropName: initData.valuePropName,
                        disabled: initData.disabled
                    }).then(function (finder) {
                        finder.onChange(function () {
                            var valueData = finder.getValueData(),
                                entity = valueData;

                            if (valueData) {
                                appendEntity(entity);
                                _events.onChange.invoke();
                            }

                            finder.value(null);
                        });
                    });
                }

                function initGrid() {
                    var gridModel = {
                        columns: [],
                        settings: {
                            autoTruncatedContent: true,
                            noData: {
                                text: initData.noDataText || resources.noData
                            }
                        },
                        rows: []
                    };

                    collections.foreach(initData.gridColumns, function (column, index) {
                        gridModel.columns.push({
                            name: column.name,
                            text: column.text,
                            css: column.css
                        });

                        _columnsMap[column.name] = index;
                    });

                    gridModel.columns.push({
                        name: 'Actions',
                        css: 'w-100 text-center'
                    });

                    return grid.init(containerHelper.appendTo(_$gridContainer, container.ready()), gridModel).then(function (inst) {
                        _grid = inst;
                       
                        return _grid;
                    });
                }

                function init(success) {
                    _$finderContainer = $('<div />');
                    _$gridContainer = $('<div class="margin-b-10" />');

                    _$wrapper.append(_$gridContainer);
                    _$wrapper.append(_$finderContainer);

                    container.setContent(_$wrapper);

                    var promises = [initFinder(), initGrid()];

                    promise.all<any>(promises).then(function () {
                        setValue(initData.value).then(function () {
                            setReadOnly(initData.readOnly);
                            success(control);
                        })
                    });
                }

                control.getData = function () {
                    var dataArray = collections.from(_grid.getRows()).select(function (row) {
                        return row.data;
                    }).toArray();

                    return collections.clone(dataArray);
                };

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
                        return _disabled;
                    }
                };

                control.readOnly = function (readOnly) {
                    if (readOnly !== undefined) {
                        setReadOnly(readOnly);
                    } else {
                        return _readOnly;
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
        } as UI.IGridEntityFinderFactory;
    }
]);