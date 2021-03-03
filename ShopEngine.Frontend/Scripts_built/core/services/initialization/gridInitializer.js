app.registerComponent('gridInitializer', 'Services', [
    'Promise',
    'Collections',
    'UI.grid',
    function (promise, collections, grid) {
        'use strict';
        return {
            init: function (container, initData) {
                var service = {}, _cellsInitializers;
                function getGridRow(rowData, index) {
                    var row = {
                        data: rowData,
                        cells: [],
                        details: undefined
                    };
                    collections.foreach(_cellsInitializers, function (cellInitializer) {
                        var cell = cellInitializer(rowData, row, index);
                        row.cells.push(cell);
                    });
                    if (initData.rowDetailsInitializer) {
                        var details = initData.rowDetailsInitializer(rowData, row, index);
                        if (details) {
                            row.details = details;
                        }
                    }
                    return row;
                }
                function initGrid() {
                    var gridModel = {
                        columns: [],
                        rows: [],
                        settings: initData.settings,
                        sortingData: initData.sortingData
                    };
                    _cellsInitializers = [];
                    if (!initData.settings.sortable) {
                        gridModel.sortingData = null;
                    }
                    else if (!gridModel.sortingData) {
                        gridModel.sortingData = {};
                    }
                    collections.foreach(initData.columns, function (column) {
                        gridModel.columns.push(column.header);
                        _cellsInitializers.push(column.cellInitializer);
                        if (!gridModel.sortingData) {
                            return;
                        }
                        if (!column.sortable && gridModel.sortingData[column.header.name]) {
                            delete gridModel.sortingData[column.header.name];
                        }
                        if (column.sortable && !gridModel.sortingData[column.header.name]) {
                            gridModel.sortingData[column.header.name] = {};
                        }
                    });
                    collections.foreach(initData.items, function (item, index) {
                        gridModel.rows.push(getGridRow(item, index));
                    });
                    if (service.grid) {
                        service.grid.remove();
                    }
                    return grid.init(container, gridModel);
                }
                function init(success) {
                    initGrid().then(function (grid) {
                        service.grid = grid;
                        success(service);
                    });
                }
                service.append = function (data) {
                    var rowData = getGridRow(data, service.grid.getRows().length);
                    service.grid.appendRow(rowData);
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);
