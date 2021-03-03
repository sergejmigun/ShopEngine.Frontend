app.registerComponent('gridView', 'Components', [
    '$',
    'Promise',
    'Components',
    'Resources.UI',
    'Collections',
    'Utils.urls',
    'Utils.objects',
    'Services',
    'Services.containerHelper',
    'UI.dropDownMenu',
    'UI.pagination',
    'UI.singleSelectList',
    'UI.searchBox',
    'UI.fixedArea',
    'UI.loader',
    function ($: JQueryStatic,
        promise: IPromise,
        templates: ITemplates,
        resources: Resources.UI,
        collections: ICollections,
        urls: Utils.IUrls,
        objects: Utils.IObjects,
        services,
        containerHelper: Services.IContainerHelper,
        dropDownMenu: UI.IDropDownMenuFactory,
        pagination: UI.IPaginationFactory,
        singleSelectList: UI.ISingleSelectListFactory,
        searchBox: UI.ISearchBoxFactory,
        fixedArea: UI.IFixedAreaFactory,
        loader: UI.ILoaderFactory) {
        'use strict';

        return {
            init: function (model, container) {
                var template = {} as Components.Grid.IGridView<any, Components.Grid.IGridTemplate<any>>,
                    _$html: JQuery,
                    _loader,
                    _pagination,
                    _$gridViewContainer: JQuery,
                    _$gridFilterContainer: JQuery,
                    _$gridFilter: JQuery,
                    _$gridGlobalActions: JQuery,
                    _$gridViewTitle: JQuery,
                    _$gridViewInfo: JQuery,
                    _$gridPageSizeWrapper: JQuery,
                    _$gridSearchWrapper: JQuery,
                    _$gridWrapper: JQuery,
                    _$pagingWrapper: JQuery,
                    _fetchingData = {
                        requestData: undefined as Components.Grid.IGridViewRequest,
                        total: undefined as number
                    };

                function displayFetchingInfo(fetchingData) {
                    if (model.hideFetchingInfo) {
                        _$gridViewInfo.closest('.gridInfoContainer').remove();

                        return;
                    }

                    function getSpan(value) {
                        return $('<b class="margin-10" />').text(value);
                    }

                    if (fetchingData.total === 0) {
                        _$gridViewInfo.html(resources.noRecords);
                    } else {
                        var $span = $('<span />'),
                            from = (fetchingData.requestData.page - 1) * fetchingData.requestData.pageSize + 1,
                            to = fetchingData.requestData.page * fetchingData.requestData.pageSize;

                        if (to > fetchingData.total) {
                            to = fetchingData.total;
                        }

                        $span.append(resources.displaying)
                            .append(getSpan(from))
                            .append(resources.to)
                            .append(getSpan(to))
                            .append(resources.of)
                            .append(getSpan(fetchingData.total))
                            .append(resources.foundRecords);

                        _$gridViewInfo.empty().append($span);
                    }
                }

                function fetch() {
                    _loader.show();

                    var requestData = objects.clone(_fetchingData.requestData),
                        filterData = _fetchingData.requestData.filterData;

                    delete requestData.filterData;

                    if (filterData) {
                        objects.extend(filterData, requestData);
                    }

                    return model.fetchingFunc(requestData).then(function (responseData) {
                        _loader.hide();
                        _fetchingData.total = responseData.total;
                        displayFetchingInfo(_fetchingData);
                        urls.setParamsUrlHash(_fetchingData.requestData);

                        return responseData;
                    });
                }

                function refresh() {
                    fetch().then(function (responseData) {
                        if (!objects.isEmptyArray(_fetchingData.requestData.orderData)) {
                            responseData.sortingData = {};

                            collections.foreach(_fetchingData.requestData.orderData, function (orderDataItem, index) {
                                responseData.sortingData[orderDataItem.column] = {
                                    index: index,
                                    direction: orderDataItem.direction
                                };
                            });
                        }

                        template.grid.refresh(responseData);
                        _pagination.changeTotal(responseData.total);
                        _pagination.changePageSize(_fetchingData.requestData.pageSize);
                    });
                }

                function fetchInitial() {
                    function initPaging(page, pageSize, total) {
                        pagination.init(containerHelper.appendTo(_$pagingWrapper, container.ready()), {
                            page: page,
                            pageSize: pageSize,
                            total: total
                        }).then(function (pagination) {
                            _pagination = pagination;

                            pagination.pageChanged(function(page) {
                                _fetchingData.requestData.page = parseInt(page.toString(), 10);
                                refresh();
                            });
                        });
                    }

                    return promise.create(function (success) {
                        fetch().then(function (responseData) {
                            initPaging(_fetchingData.requestData.page, _fetchingData.requestData.pageSize, responseData.total);
                            responseData.gridData = model.gridData;

                            model.gridTemplateFactory.init(responseData as any, containerHelper.appendTo(_$gridWrapper, container.ready())).then(function(gridTemplate) {
                                template.grid = gridTemplate;

                                template.grid.onChangeOrder(function(orderData) {
                                    _fetchingData.requestData.orderData = collections.from(orderData).select(function(orderDataItem: any) {
                                        return {
                                            column: orderDataItem.column,
                                            direction: orderDataItem.direction
                                        };
                                    }).toArray();

                                    refresh();
                                });

                                success();
                            });
                        });
                    });
                }

                function applyFilterData() {
                    _fetchingData.requestData.filterData = objects.tryGet(model.gridFilter, 'data');
                }

                function initFilter() {
                    if (!objects.tryGet(model.gridFilter, 'template')) {
                        return;
                    }
                  
                    templates.init(model.gridFilter.template, containerHelper.custom(function(templateContent) {
                        _$gridFilter.append(templateContent);

                        fixedArea.init(_$gridFilterContainer, {
                            marginTop: -45
                        });
                    }, container.ready())).then(function(filterTemplate) {
                        filterTemplate.onSubmit(function(filterData) {
                            model.gridFilter.data = filterData;
                            applyFilterData();
                            refresh();

                            ($ as any).scrollTo(_$gridViewTitle, 500, {
                                easing: 'swing'
                            });
                        });
                    });
                }

                function initGlobalActions() {
                    if (objects.isEmptyArray(model.actions)) {
                        _$gridGlobalActions.remove();

                        return;
                    }

                    dropDownMenu.init(containerHelper.appendTo(_$gridGlobalActions, container.ready()), {
                        currentItemButton: model.actions[0],
                        items: collections.from<any>(model.actions).skip(1).toArray(),
                        size: UI.ButtonSize.Medium
                    });
                }

                function initSearchBox() {
                    if (model.hideSearchBox) {
                        _$gridSearchWrapper.remove();

                        return;
                    }

                    searchBox.init(containerHelper.appendTo(_$gridSearchWrapper, container.ready()), {
                        value: _fetchingData.requestData.searchBy
                    }).then(function (searchBox) {
                        searchBox.submit(function (value) {
                            _fetchingData.requestData.page = 1;
                            _fetchingData.requestData.searchBy = value;
                            refresh();
                        });
                    });
                }

                function initPageSizeList() {
                    if (model.hideGridSizeSelection) {
                        _$gridPageSizeWrapper.remove();

                        return;
                    }

                    var listItems = [];

                    function addListItem(value) {
                        listItems.push({
                            value: value
                        });
                    }

                    addListItem(4);
                    addListItem(10);
                    addListItem(20);
                    addListItem(50);
                    addListItem(100);

                    singleSelectList.init(containerHelper.replace(_$gridPageSizeWrapper.find('input'), container.ready()), {
                        items: listItems,
                        value: _fetchingData.requestData.pageSize
                    }).then(function (list) {
                        list.onChange(function() {
                            _fetchingData.requestData.pageSize = parseInt(list.value().toString());
                            _fetchingData.requestData.page = 1;
                            refresh();
                        });
                    });
                }

                function initRequestData() {
                    function getMapping() {
                        var mapping = {
                            page: {
                                def: 1,
                                format: function (val) {
                                    return parseInt(val, 10) || 1;
                                }
                            },
                            pageSize: {
                                def: 10,
                                format: function (val) {
                                    return parseInt(val, 10) || 10;
                                }
                            },
                            searchBy: {
                                def: ''
                            },
                            orderData: {
                                def: [],
                                format: function (val) {
                                    if (objects.isEmptyArray(val)) {
                                        return [];
                                    }

                                    var orderDataMapping = ['column', {
                                        direction: {
                                            def: 1,
                                            format: function (val) {
                                                var value = parseInt(val, 10);

                                                return (value === 1 || value === 2)
                                                    ? value
                                                    : 1;
                                            }
                                        }
                                    }];

                                    var res = [];

                                    collections.foreach(val, function (orderDataItem) {
                                        res.push(objects.createAndMap(orderDataItem, orderDataMapping));
                                    });

                                    return res;
                                }
                            }
                        };

                        return mapping;
                    }

                    var hashData = urls.getParamsFromUrlHash() || {};

                    _fetchingData.requestData = objects.createAndMap(hashData, getMapping());
                    applyFilterData();
                }

                function init(success) {
                    if (objects.tryGet(model.gridFilter, 'template')) {
                        _$gridFilterContainer.addClass('col-md-3');
                        _$gridViewContainer.addClass('col-md-9');
                    } else {
                        _$gridFilterContainer.remove();
                        _$gridViewContainer.addClass('col-md-12');
                    }

                    container.setContent(_$html);

                    if (!model.gridViewTitle) {
                        _$gridViewTitle.remove();
                    } else {
                        _$gridViewTitle.text(model.gridViewTitle);
                    }

                    loader.initOverlay(_$gridViewContainer).then(function (inst) {
                        _loader = inst;

                        initRequestData();
                        initPageSizeList();
                        initSearchBox();
                        initGlobalActions();
                        initFilter();

                        fetchInitial().then(function () {
                            template.refresh = function () {
                                refresh();
                            };

                            success(template);
                        });
                    });
                }

                return promise.create(function (success) {
                    services.apiService.getTemplateHtml('gridView').then(function (html) {
                        _$html = $(html);
                        _$gridViewContainer = _$html.find('.gridViewContainer');
                        _$gridFilterContainer = _$html.find('.gridFilterContainer');
                        _$gridFilter = _$gridFilterContainer.find('.gridFilter');
                        _$gridGlobalActions = _$html.find('.gridGlobalActions');
                        _$gridViewTitle = _$html.find('.gridViewTitle');
                        _$gridViewInfo = _$html.find('.gridViewInfo');
                        _$gridPageSizeWrapper = _$html.find('.gridPageSizeWrapper');
                        _$gridSearchWrapper = _$html.find('.gridSearchWrapper');
                        _$gridWrapper = _$html.find('.gridWrapper');
                        _$pagingWrapper = _$html.find('.pagingWrapper');
                        init(success);
                    });
                });
            }
        } as Components.Grid.IGridViewFactory<any, Components.Grid.IGridTemplate<any>>;
    }
]);