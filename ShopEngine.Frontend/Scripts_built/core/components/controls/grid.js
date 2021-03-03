app.registerComponent('grid', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Collections',
    'Services.eventsInitializer',
    'UI',
    function ($, promise, objects, collections, eventsInitializer, ui) {
        'use strict';
        return {
            init: function (container, initData) {
                var _$wrapper = $('<div class="grid-wrapper" />'), _$table, _$tbody, _$nodataTr, _$mainSelectionInput, _maxGroupingDetpth = 0;
                var _rows = [];
                var _columns = [];
                var _events = {
                    onOrderChanged: eventsInitializer.initEvent(),
                    onSelectionChanged: eventsInitializer.initVoidEvent(),
                    onRowsOrderChanged: eventsInitializer.initVoidEvent(),
                    onRenderCompleted: eventsInitializer.initVoidEvent(),
                    onToggleDetails: eventsInitializer.initEvent()
                };
                var _control = {
                    onOrderChanged: _events.onOrderChanged.event,
                    onSelectionChanged: _events.onSelectionChanged.event,
                    onRowsOrderChanged: _events.onRowsOrderChanged.event,
                    onRenderCompleted: _events.onRenderCompleted.event,
                    onToggleDetails: _events.onToggleDetails.event,
                    getSelectedRows: function () {
                        if (!initData.settings.selectable) {
                            return;
                        }
                        var resultArray = [];
                        function fillSelectedRows(rows) {
                            collections.foreach(rows, function (row) {
                                if (row.innerRows) {
                                    fillSelectedRows(row.innerRows);
                                }
                                else {
                                    if (row.selected) {
                                        resultArray.push(objects.clone(row.data));
                                    }
                                }
                            });
                        }
                        fillSelectedRows(_rows);
                        return resultArray;
                    },
                    getRows: function () {
                        return collections.from(_rows).select(function (row) {
                            return {
                                data: row.data,
                                show: function () {
                                    row.element.show();
                                },
                                hide: function () {
                                    row.element.hide();
                                },
                                cells: getCells(row.cells)
                            };
                        }).toArray();
                    },
                    getColumns: function () {
                        return collections.from(_columns).select(function (column) {
                            return {
                                name: column.name,
                                hide: function () {
                                    column.element.hide();
                                    column.cells.forEach(function (cell) {
                                        cell.element.hide();
                                    });
                                },
                                show: function () {
                                    column.element.show();
                                    column.cells.forEach(function (cell) {
                                        cell.element.show();
                                    });
                                },
                                cells: getCells(column.cells)
                            };
                        }).toArray();
                    },
                    appendRow: function (row) {
                        if (_$nodataTr) {
                            _$nodataTr.remove();
                            _$nodataTr = null;
                        }
                        var buildRowResult = buildRow(row);
                        _$tbody.append(buildRowResult.row.element);
                        _rows.push(buildRowResult.row);
                        return buildRowResult.buildPromise;
                    },
                    removeRows: function (predicate) {
                        removeRows(predicate);
                    },
                    remove: function () {
                        _$table.remove();
                    }
                };
                function initFixedHeaders() {
                    if (initData.settings.fixedHeaders.offset) {
                        _$table['stickyTableHeaders']({
                            fixedOffset: initData.settings.fixedHeaders.offset
                        });
                    }
                    else {
                        _$table['stickyTableHeaders']();
                    }
                }
                function getCells(cells) {
                    return collections.from(cells).select(function (cell) {
                        return {
                            data: cell.data,
                            showContent: function () {
                                cell.element.first().hide();
                            },
                            hideContent: function () {
                                cell.element.first().show();
                            },
                            getContent: function () {
                                return cell.contentObj.content;
                            }
                        };
                    }).toArray();
                }
                function initRowsOrdering() {
                    var oldIndex;
                    _$table['sortable']({
                        containerSelector: 'table',
                        itemPath: '> tbody',
                        itemSelector: 'tr',
                        handle: '.rowsOrdering',
                        placeholder: '<tr class="drag-placeholder"/>',
                        onDragStart: function ($item, container, _super) {
                            oldIndex = $item.index();
                            $item.appendTo($item.parent());
                            _super($item, container);
                        },
                        onDrop: function ($item, container) {
                            $item.removeClass(container.group.options.draggedClass).removeAttr("style");
                            $("body").removeClass(container.group.options.bodyClass);
                            var newIndex = $item.index();
                            if (oldIndex !== newIndex) {
                                objects.moveArrayItem(_rows, oldIndex, newIndex);
                                _events.onRowsOrderChanged.invoke();
                            }
                        }
                    });
                }
                function addAdditionalHeader(content, css) {
                    var $column = $('<th class="grid-aux-column" />')
                        .addClass(css === undefined
                        ? 'grid-no-border-side'
                        : css);
                    if (content) {
                        $column.append(content);
                    }
                    $column.insertBefore(_columns[0].element);
                }
                function selectRows(rowData) {
                    rowData.selectInput.prop('checked', rowData.selected);
                    if (rowData.innerRowsData) {
                        collections.foreach(rowData.innerRowsData, function (innerRowData) {
                            innerRowData.row.selected = rowData.selected;
                            selectRows(innerRowData);
                        });
                    }
                }
                function selectionChanged(row) {
                    function deselectParents(row) {
                        if (row.parentRow) {
                            row.parentRow.selectInput.prop('checked', false);
                            row.parentRow.selected = false;
                            deselectParents(row.parentRow);
                        }
                        else {
                            _$mainSelectionInput.prop('checked', false);
                        }
                    }
                    row.selectInput.change(function () {
                        row.selected = !row.selected;
                        selectRows(row);
                        if (!row.selected) {
                            deselectParents(row);
                        }
                        _events.onSelectionChanged.invoke();
                    });
                }
                function buildCells($tr, row, cells) {
                    var renderPromises = [];
                    collections.foreach(cells, function (cell, i) {
                        var $td = $('<td />');
                        $tr.append($td);
                        var contentObj = {
                            content: undefined
                        };
                        var cellData = {
                            element: $td,
                            data: cell.data,
                            contentObj: contentObj
                        };
                        _columns[i].cells.push(cellData);
                        row.cells[i] = cellData;
                        renderPromises.push(ui.renderItem($td, container.ready(), cell, objects.tryGet(cell.data, 'text'), true).then(function (content) {
                            contentObj.content = content;
                            return content;
                        }));
                    });
                    return promise.all(renderPromises);
                }
                function buildDetailsRow($tr, details, row, groupingDepth) {
                    var $detailsTr = $('<tr class="grid-details-row" />'), $detailsTd = $('<td class="grid-details-cell" />').attr('colspan', _columns.length), $detailsButtonTd = $('<td class="grid-no-border-l grid-details-column" />'), rendered = false;
                    row.details = {
                        element: $detailsTr,
                        expanded: details.expanded
                    };
                    $tr.append($detailsButtonTd);
                    function toggleDetailsRow() {
                        if (!row.details.expanded) {
                            row.details.element.hide();
                            $detailsButtonTd.empty().append($('<i class="glyphicon glyphicon-menu-right" />'));
                        }
                        else {
                            row.details.element.show();
                            if (!rendered) {
                                ui.renderItem($detailsTd, container.ready(), details, '', true);
                                rendered = true;
                            }
                            $detailsButtonTd.empty().append($('<i class="glyphicon glyphicon-menu-down" />'));
                        }
                        _events.onToggleDetails.invoke({
                            data: row.data,
                            expanded: row.details.expanded
                        });
                    }
                    $detailsButtonTd.click(function () {
                        row.details.expanded = !row.details.expanded;
                        toggleDetailsRow();
                    });
                    toggleDetailsRow();
                    if (groupingDepth) {
                        $detailsTr.append($('<td class="grid-no-border-r" />').attr('colspan', groupingDepth));
                    }
                    $detailsTr.append($('<td class="grid-no-border-l grid-details-span-cell" />').attr('colspan', initData.settings.selectable
                        ? 2
                        : 1));
                    $detailsTr.append($detailsTd);
                    $detailsTr.insertAfter($tr);
                }
                function buildDataRow($tr, row, rowInitData, groupingDepth) {
                    if (initData.settings.selectable) {
                        row.selectInput = $('<input type="checkbox" />');
                        $tr.append(row.selectInput.wrap('<td class="grid-no-border-side text-center" />').parent());
                        selectionChanged(row);
                    }
                    if (initData.settings.rowsOrdering) {
                        $tr.append('<td class="rowsOrdering"><i class="glyphicon glyphicon-resize-vertical" /></td>');
                    }
                    if (groupingDepth) {
                        $tr.append($('<td class="grid-no-border-side" />').attr('colspan', groupingDepth));
                    }
                    if (initData.settings.detailRows) {
                        if (rowInitData.details) {
                            buildDetailsRow($tr, rowInitData.details, row, groupingDepth);
                        }
                        else {
                            $tr.append($('<td class="grid-no-border-l" />'));
                        }
                    }
                    return buildCells($tr, row, rowInitData.cells);
                }
                function buildGroupingRow($groupingTr, row, rowInitData, depth) {
                    function showInnerRows(row) {
                        if (!row.innerRows) {
                            return;
                        }
                        collections.foreach(row.innerRows, function (innerRow) {
                            if (!row.groupCollapsed) {
                                innerRow.element.show();
                                showInnerRows(innerRow);
                                if (initData.settings.detailRows && innerRow.details && innerRow.details.expanded) {
                                    innerRow.details.element.show();
                                }
                            }
                        });
                    }
                    function hideInnerRows(row) {
                        if (!row.innerRows) {
                            return;
                        }
                        collections.foreach(row.innerRows, function (innerRow) {
                            innerRow.element.hide();
                            hideInnerRows(innerRow);
                            if (initData.settings.detailRows && innerRow.details) {
                                innerRow.details.element.hide();
                            }
                        });
                    }
                    function toggleGrouping($groupingButtonTd, row) {
                        if (row.groupCollapsed) {
                            $groupingButtonTd.append($('<i />').attr('class', 'glyphicon glyphicon-triangle-right'));
                            hideInnerRows(row);
                        }
                        else {
                            $groupingButtonTd.append($('<i />').attr('class', 'glyphicon glyphicon-triangle-right rotate-45'));
                            showInnerRows(row);
                        }
                    }
                    var colspan = _columns.length + (_maxGroupingDetpth - depth);
                    if (initData.settings.detailRows) {
                        colspan += 1;
                    }
                    var buildPromises = [], $groupingButtonTd = $('<td class="grid-group-button grid-no-border-side" />'), $groupingTd = $('<td class="grid-no-border-l" />').attr('colspan', colspan);
                    if (initData.settings.selectable) {
                        var selectInput = $('<input type="checkbox" />');
                        $groupingTr.append(selectInput.wrap('<td class="grid-no-border-side text-center"></td>').parent());
                        selectionChanged(row);
                    }
                    if (depth > 1) {
                        $groupingTr.append($('<td class="grid-no-border-side" />').attr('colspan', depth - 1));
                    }
                    $groupingTr.append($groupingButtonTd);
                    $groupingTr.append($groupingTd);
                    buildPromises.push(ui.renderItem($groupingTd, container.ready(), rowInitData, objects.tryGet(rowInitData.data, 'text'), true));
                    row.innerRows = [];
                    collections.foreach(rowInitData.innerRows, function (innerRowInitData) {
                        var buildRowResult = buildRow(innerRowInitData), innerRow = buildRowResult.row;
                        innerRow.parentRow = row;
                        buildRowResult.row.element.insertAfter($groupingTr);
                        row.innerRows.push(innerRow);
                        buildPromises.push(buildRowResult.buildPromise);
                    });
                    $groupingButtonTd.click(function () {
                        rowInitData.groupCollapsed = !rowInitData.groupCollapsed;
                        toggleGrouping($groupingButtonTd, row);
                    });
                    toggleGrouping($groupingButtonTd, row);
                    return promise.all(buildPromises);
                }
                function buildNoDataRow() {
                    if (_$nodataTr) {
                        return;
                    }
                    _$nodataTr = $('<tr />');
                    _$tbody.append(_$nodataTr);
                    var $td = $('<td />').attr('colspan', _columns.length), noDataSetting = initData.settings.noData;
                    _$nodataTr.append($td);
                    return ui.renderItem($td, container.ready(), noDataSetting, 'No data', true);
                }
                function removeRows(predicate) {
                    var toBeRemoved = [];
                    collections.foreach(_rows, function (rowData) {
                        if (predicate(rowData.data)) {
                            toBeRemoved.push(rowData);
                        }
                    });
                    collections.foreach(toBeRemoved, function (rowData) {
                        rowData.element.remove();
                        collections.remove(_rows, rowData);
                    });
                    if (!_rows.length) {
                        buildNoDataRow();
                    }
                }
                function buildRow(rowInitData) {
                    var $tr = $('<tr />'), row = {
                        element: $tr,
                        data: rowInitData.data,
                        cells: []
                    };
                    var buildPromise;
                    _$tbody.append($tr);
                    if (initData.settings.grouping) {
                        buildPromise = buildGroupingRow($tr, row, rowInitData, 1);
                    }
                    else if (rowInitData.cells) {
                        buildPromise = buildDataRow($tr, row, rowInitData);
                    }
                    return {
                        row: row,
                        buildPromise: buildPromise
                    };
                }
                function buildRows() {
                    var buildPromises = [];
                    collections.foreach(initData.rows, function (row) {
                        var buildRowResult = buildRow(row);
                        _rows.push(buildRowResult.row);
                        buildPromises.push(buildRowResult.buildPromise);
                    });
                    return promise.all(buildPromises);
                }
                function buildAdditionalColumns() {
                    if (initData.settings.selectable) {
                        _$mainSelectionInput = $('<input type="checkbox" />');
                        addAdditionalHeader(_$mainSelectionInput, 'w-30 text-center');
                        _$mainSelectionInput.change(function () {
                            collections.foreach(_rows, function (rowData) {
                                rowData.selected = _$mainSelectionInput.prop('checked');
                                selectRows(rowData);
                            });
                            _events.onSelectionChanged.invoke();
                        });
                    }
                    if (initData.settings.detailRows) {
                        addAdditionalHeader();
                    }
                    if (initData.settings.rowsOrdering) {
                        addAdditionalHeader('<i class="glyphicon glyphicon-resize-vertical" />', '');
                    }
                    if (initData.settings.grouping) {
                        collections.repeat(_maxGroupingDetpth, function () {
                            addAdditionalHeader();
                        });
                    }
                }
                function initColumnsOrdering(columnInner, columnData) {
                    function toggleDirection(columnSortingData) {
                        if (columnSortingData && columnSortingData.direction) {
                            if (columnSortingData.direction === 'asc') {
                                return 'desc';
                            }
                            return 'asc';
                        }
                        return 'asc';
                    }
                    function toggleSortingData(colName, multiSorting) {
                        var result = [], columnSortingData = initData.sortingData[colName];
                        if (!columnSortingData) {
                            return;
                        }
                        if (multiSorting) {
                            if (!columnSortingData.hasOwnProperty('index')) {
                                columnSortingData.index = collections.fromObject(initData.sortingData).where(function (obj) {
                                    return obj.value.hasOwnProperty('index');
                                }).count();
                            }
                            columnSortingData.direction = toggleDirection(columnSortingData);
                        }
                        else {
                            collections.foreach(initData.sortingData, function (sortingDataItem, key) {
                                if (key === colName) {
                                    sortingDataItem.index = 0;
                                    columnSortingData.direction = toggleDirection(sortingDataItem);
                                }
                                else {
                                    delete sortingDataItem.index;
                                    delete sortingDataItem.direction;
                                }
                            });
                        }
                        collections.fromObject(initData.sortingData).where(function (obj) {
                            return obj.value.hasOwnProperty('index');
                        }).foreach(function (obj) {
                            result[obj.value.index] = {
                                column: obj.name,
                                direction: obj.value.direction
                            };
                        });
                        return result;
                    }
                    function setOrderButtonContent(columnData) {
                        var $button = columnData.orderButton, name = columnData.column.name;
                        $button.append($('<i class="glyphicon glyphicon-triangle-top up" />'));
                        $button.append($('<i class="glyphicon glyphicon-triangle-bottom down" />'));
                        if (initData.sortingData[name]) {
                            if (initData.sortingData[name].direction === 'asc') {
                                $button.addClass('grid-order-asc');
                            }
                            else if (initData.sortingData[name].direction === 'desc') {
                                $button.addClass('grid-order-desc');
                            }
                            if (collections.fromObject(initData.sortingData).count() > 1) {
                                $button.prepend(initData.sortingData[name].index + 1);
                            }
                        }
                    }
                    columnInner.addClass('padding-r-30');
                    columnData.orderButton = $('<span class="grid-order-button" />');
                    columnInner.append(columnData.orderButton);
                    setOrderButtonContent(columnData);
                    columnData.orderButton.click(function (e) {
                        _events.onOrderChanged.invoke(toggleSortingData(columnData.column.name, e.ctrlKey));
                    });
                }
                function buildDataColumns($thead) {
                    var $tr = $('<tr />'), buildColumnsPromises = [];
                    $thead.append($tr);
                    collections.foreach(initData.columns, function (column) {
                        var $th = $('<th />'), $inner = $('<div class="grid-column-header" />'), $innerContent = $('<div />'), columnData = {
                            element: $th,
                            column: column,
                            name: column.name,
                            cells: []
                        };
                        $inner.append($innerContent);
                        if (initData.settings.sortable && initData.sortingData[column.name]) {
                            initColumnsOrdering($inner, columnData);
                        }
                        $tr.append($th);
                        $th.append($inner);
                        _columns.push(columnData);
                        if (column.css) {
                            $th.addClass(column.css);
                            delete column.css;
                        }
                        buildColumnsPromises.push(ui.renderItem($innerContent, container.ready(), column, column.name, true));
                    });
                    return promise.all(buildColumnsPromises);
                }
                function calculateMaxGroupingDepth(groupingRow) {
                    if (groupingRow.innerRows) {
                        _maxGroupingDetpth += 1;
                        calculateMaxGroupingDepth(groupingRow.innerRows[0]);
                    }
                }
                function buildTable() {
                    var tableHtml = '<table class="table-responsive table-bordered table-hover table-striped table-condensed">'
                        + '<thead class="grid-headers" />'
                        + '<tbody />'
                        + '</table>', $thead, buildPromises = [];
                    _$table = $(tableHtml);
                    _$tbody = _$table.find('tbody');
                    $thead = _$table.find('thead');
                    _$wrapper.append(_$table);
                    if (initData.settings.autoTruncatedContent) {
                        _$table.addClass('grid-layout-fixed');
                    }
                    buildPromises.push(buildDataColumns($thead));
                    if (!initData.rows.length) {
                        buildPromises.push(buildNoDataRow());
                    }
                    else {
                        if (initData.settings.grouping) {
                            calculateMaxGroupingDepth(initData.rows[0]);
                        }
                        buildAdditionalColumns();
                        buildPromises.push(buildRows());
                    }
                    ;
                    return promise.all(buildPromises);
                }
                function init(success) {
                    container.setContent(_$wrapper);
                    buildTable().then(function () {
                        _$table.find('th:first').removeClass('grid-no-border-side').addClass('grid-no-border-r');
                        if (initData.settings.fixedHeaders) {
                            initFixedHeaders();
                        }
                        if (initData.settings.rowsOrdering) {
                            initRowsOrdering();
                        }
                        _events.onRenderCompleted.invoke();
                        success(_control);
                    });
                }
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);
