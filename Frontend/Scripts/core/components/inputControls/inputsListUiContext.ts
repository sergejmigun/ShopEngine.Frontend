app.registerComponent('inputsListUiManager', 'Services', [
    '$',
    'Promise',
    'Collections',
    'UI',
    'UI.dropDownMenu',
    'UI.checkBox',
    'UI.buttons',
    'Services.apiService',
    'Services.containerHelper',
    function ($: JQueryStatic,
        promise: IPromise,
        collections: ICollections,
        ui: IUi,
        dropDownMenu: UI.IDropDownMenuFactory,
        checkBox: UI.ICheckBoxFactory,
        buttons: UI.IButtonsFactory,
        apiService: Services.IApiService,
        containerHelper: Services.IContainerHelper) {
        'use strict';

        return {
            init: function (initData) {
                var context = {} as Services.InputsList.IInputsListContext,
                    _$wrapper: JQuery,
                    _$inputsTable: JQuery,
                    _$tableBody: JQuery,
                    _$firstGroupTableBody: JQuery,
                    _$header: JQuery,
                    _$addButtonWrapper: JQuery,
                    _$noData: JQuery;

                function getColspan(...args) {
                    var initialColspan = args[0];

                    collections.from(args).skip(1).foreach(function (condition) {
                        if (condition) {
                            initialColspan += 1;
                        }
                    });

                    return initialColspan;
                }

                context.initHeader = function (header) {
                    var $headerRow = $('<tr />'),
                        $headerTd = $('<td class="inputs-list-control-cell" />');

                    if (initData.hasGroups) {
                        $headerRow.append('<td />');
                    }

                    if (initData.sortable) {
                        $headerRow.append('<td class="ordering-cell" />');
                    }

                    if (initData.selectable) {
                        $headerRow.append('<td />');
                    }

                    $headerRow.append($headerTd);
                    $headerRow.append('<td class="button-cell" />');
                    ui.renderItem($headerTd, initData.containerReady, header);
                    _$header.append($headerRow).show();
                };

                context.showNoDataMessage = function () {
                    _$noData.show();
                    _$header.hide();
                };

                context.initAddButton = function (addButtonText, action) {
                    var addButton = buttons.add({
                        text: addButtonText,
                        action: action
                    }, containerHelper.appendTo(_$addButtonWrapper, initData.containerReady));

                    return addButton;
                };

                context.setReadOnly = function () {
                    _$inputsTable.find('td.ordering-cell').hide();
                    _$inputsTable.find('td.button-cell').hide();
                };

                context.initSortable = function (onSort) {
                    var oldIndex;

                    _$tableBody.addClass('sortable');

                    _$inputsTable['sortable']({
                        containerSelector: 'table',
                        itemSelector: 'tr',
                        itemPath: '> tbody.sortable',
                        handle: '.rowsOrdering',
                        exclude: '.inputs-list-item-group',
                        placeholder: '<tr class="drag-placeholder"/>',
                        onDragStart: function ($item, container, _super) {
                            oldIndex = $item.index();
                            $item.appendTo($item.parent());
                            _super($item, container);
                        },
                        onDrop: function ($item, container) {
                            $item.removeClass(container.group.options.draggedClass).removeAttr("style");
                            $("body").removeClass(container.group.options.bodyClass);
                            onSort(oldIndex, $item.index());
                        }
                    });
                };

                context.prependGroupRow = function (prevGroupData, nextGroupData, isFirst) {
                    if (isFirst) {
                        _$tableBody.prepend(prevGroupData.container);
                        prevGroupData.appendItem = function (itemContainer) {
                            prevGroupData.container.after(itemContainer);
                        };

                        _$firstGroupTableBody.append(nextGroupData.container);
                        nextGroupData.appendItem = function (itemContainer) {
                            _$tableBody.prepend(itemContainer);
                        };
                    } else {
                        prevGroupData.container.before(nextGroupData.container);
                        nextGroupData.appendItem = function (itemContainer) {
                            nextGroupData.container.after(itemContainer);
                        };
                    }

                    var lastControlContainer;

                    collections.foreach(nextGroupData.controlsData, function (controlData, index) {
                        if (index === 0) {
                            nextGroupData.appendItem(controlData.container);
                        } else {
                            lastControlContainer.after(controlData.container);
                        }

                        lastControlContainer = controlData.container;
                    });
                };

                context.renderGroupRow = function (groupData, isFirstRow) {
                    var $tr = $('<tr class="inputs-list-item inputs-list-item-group" />'),
                        $tdHeader = $('<td class="grouping-header" />'),
                        $tdTitle = $('<td class="grouping-title" />'),
                        $title = $('<h4 />'),
                        colspan = getColspan(2, initData.selectable, initData.sortable);

                    function showGroupViewState(groupData) {
                        var controlAction;

                        if (groupData.expanded) {
                            groupData.groupingButton.html('<i class="fa fa-minus" aria-hidden="true"></i>');
                            controlAction = function (controlData) {
                                controlData.container.show();
                            };
                        } else {
                            groupData.groupingButton.html('<i class="fa fa-plus" aria-hidden="true"></i>');
                            controlAction = function (controlData) {
                                controlData.container.hide();
                            };
                        }

                        collections.foreach(groupData.controlsData, function (controlData) {
                            controlAction(controlData);
                        });
                    }

                    $tr.append($tdHeader).append($tdTitle);

                    $tdTitle.append($title.text(groupData.title)).attr('colspan', colspan);

                    groupData.groupingButton = $tdHeader;

                    $tdHeader.click(function () {
                        groupData.expanded = !groupData.expanded;
                        showGroupViewState(groupData);
                    });

                    showGroupViewState(groupData);

                    var result = {
                        updateTitle: function (title) {
                            $title.text(title);
                        }
                    } as any;

                    if (isFirstRow) {
                        _$firstGroupTableBody.html('').append($tr);

                        result.appendItem = function (itemContainer) {
                            _$tableBody.prepend(itemContainer);
                        };
                    } else {
                        _$tableBody.append($tr);

                        result.appendItem = function (itemContainer) {
                            $tr.after(itemContainer);
                        };
                    }

                    result.remove = function () {
                        $tr.remove();
                    };

                    groupData.container = $tr;

                    return result;
                };

                context.renderControlRow = function (controlInitializer, value, actionsData) {
                    var $tr = $('<tr class="inputs-list-item" />'),
                        $tdActions = $('<td class="button-cell" />'),
                        $input = $('<input type="hidden" />'),
                        checkBoxPromise,
                        dropDownMenuInst;

                    function prependCheckbox($tr) {
                        var $td = $('<td class="checkBox-cell" />');

                        $tr.prepend($td);
                        checkBoxPromise = checkBox.init(containerHelper.appendTo($td, initData.containerReady), {});
                    }

                    function prependSortableButton($tr) {
                        var $orderingCell = $('<td class="ordering-cell" />');

                        buttons.roundIcon('fa-arrows-v', {
                            size: UI.ButtonSize.Small,
                            css: 'rowsOrdering',
                            action: function () { }
                        }, containerHelper.appendTo($orderingCell, initData.containerReady));

                        $tr.prepend($orderingCell);
                    }

                    function initActionsMenu(data) {
                        dropDownMenu.init(containerHelper.appendTo($tdActions, initData.containerReady), {
                            currentItemButton: data[0],
                            items: collections.from(data).skip(1).toArray() as UI.IDropDownMenuButtonData[],
                            size: UI.ButtonSize.Medium
                        }).then(function (inst) {
                            dropDownMenuInst = inst;
                        });
                    }

                    $tr.append($input.wrap('<td class="inputs-list-control-cell">').parent()).append($tdActions);

                    if (initData.selectable) {
                        prependCheckbox($tr);
                    }

                    if (initData.sortable) {
                        prependSortableButton($tr);
                    }

                    initActionsMenu(actionsData);

                    return {
                        container: $tr,
                        actionsContainer: $tdActions,
                        controlPromise: controlInitializer.init(containerHelper.replace($input, initData.containerReady), {
                            value: value
                        }),
                        checkBoxPromise: checkBoxPromise,
                        updateControlActions: function (newActionsData) {
                            if (dropDownMenuInst) {
                                dropDownMenuInst.remove();
                            }

                            initActionsMenu(newActionsData);
                        }
                    };
                };

                context.appendControlRow = function (controlData) {
                    _$tableBody.append(controlData.container);
                    _$noData.hide();
                    _$header.show();
                };

                context.appendControlRowToGroup = function (controlData) {
                    controlData.container.prepend('<td class="grouping-line"><div /></td>');
                    _$noData.hide();
                    _$header.show();
                };

                return promise.create(function (success) {
                    apiService.getTemplateHtml('inputsListTemplate').then(function (html) {
                        _$wrapper = $(html);
                        _$inputsTable = _$wrapper.find('table:first');
                        _$tableBody = _$inputsTable.find('tbody:first');
                        _$header = _$inputsTable.find('thead:first').hide();
                        _$addButtonWrapper = _$wrapper.find('.addButtonWrapper:first');
                        _$noData = $('<div class="no-data noData" />').text(initData.noItemsText);
                        _$wrapper.prepend(_$noData);

                        if (initData.hasGroups) {
                            _$firstGroupTableBody = $('<tbody />');
                            _$tableBody.before(_$firstGroupTableBody);
                        }

                        context.container = _$wrapper;

                        success(context);
                    });
                });
            }
        } as Services.InputsList.IInputsListContextFactory;
    }
]);