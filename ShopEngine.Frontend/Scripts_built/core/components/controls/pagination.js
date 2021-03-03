app.registerComponent('pagination', 'UI', [
    '$',
    'Promise',
    'Utils.urls',
    'Collections',
    'Utils.strings',
    'Services.eventsInitializer',
    function ($, promise, urls, collections, strings, eventsInitializer) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _lastPage, _targets = 5, _$lists = [], _events = eventsInitializer.init(control, ['pageChanged']);
                function togglePagination(action) {
                    collections.foreach(_$lists, function ($list) {
                        $list[action]();
                    });
                }
                function buildPagination() {
                    function go(page) {
                        if (page < 1 || page > _lastPage || page === initData.page) {
                            return;
                        }
                        if (initData.urlTemplate) {
                            urls.navigate(strings.format(initData.urlTemplate, page));
                        }
                        else {
                            initData.page = page;
                            _events.pageChanged.invoke(page);
                            buildPagination();
                        }
                    }
                    function getListItem(page, html) {
                        if (html === undefined) {
                            html = page.toString();
                        }
                        var $item = $('<li><a href="#"></a></li>');
                        $item.find('a').html(html).click(function () {
                            go(page);
                        });
                        return $item;
                    }
                    function iterateLists(func) {
                        collections.foreach(_$lists, function ($list) {
                            func($list);
                        });
                    }
                    function appendListItem(page, html) {
                        iterateLists(function ($list) {
                            $list.append(getListItem(page, html));
                        });
                    }
                    function buildPrevious() {
                        appendListItem(initData.page - 1, '«');
                    }
                    function buildNext() {
                        appendListItem(initData.page + 1, '»');
                    }
                    function buildLast() {
                        appendListItem(_lastPage, 'Last');
                    }
                    function buildFirst() {
                        appendListItem(1, 'First');
                    }
                    function buildTarget() {
                        iterateLists(function ($list) {
                            var remainingLinksCount = _targets - 1, startPage, $currentListItem = getListItem(initData.page).attr('class', 'active');
                            $list.append($currentListItem);
                            function buildPrevoiusSiblings(repeats, start) {
                                collections.repeat(repeats, function (count) {
                                    var page = start - count, $listItem = $currentListItem;
                                    if (page < 1) {
                                        return false;
                                    }
                                    startPage = page;
                                    remainingLinksCount -= 1;
                                    $currentListItem = getListItem(page);
                                    $currentListItem.insertBefore($listItem);
                                });
                            }
                            function buildNextSiblings(repeats) {
                                collections.repeat(repeats, function (count) {
                                    var page = initData.page + count;
                                    if (page > _lastPage) {
                                        return false;
                                    }
                                    remainingLinksCount -= 1;
                                    $list.append(getListItem(page));
                                });
                            }
                            buildPrevoiusSiblings(Math.round(remainingLinksCount / 2), initData.page);
                            buildNextSiblings(remainingLinksCount);
                            if (remainingLinksCount > 0 && startPage) {
                                buildPrevoiusSiblings(remainingLinksCount, startPage);
                            }
                        });
                    }
                    _lastPage = Math.ceil(initData.total / initData.pageSize);
                    if (_lastPage < 2) {
                        togglePagination('hide');
                    }
                    else {
                        togglePagination('show');
                    }
                    if (initData.page > _lastPage) {
                        initData.page = _lastPage;
                    }
                    else if (initData.page < 1) {
                        initData.page = 1;
                    }
                    iterateLists(function ($list) {
                        $list.html('');
                    });
                    buildFirst();
                    buildPrevious();
                    buildTarget();
                    buildNext();
                    buildLast();
                }
                function init(success) {
                    function initPaginationContainer() {
                        var $ul = $('<ul class="pagination" />');
                        _$lists.push($ul);
                        return $ul.wrap('<nav />').parent();
                    }
                    container.setContent(initPaginationContainer());
                    collections.safeForeach(initData.duplicateContainers, function (duplicateContainer) {
                        duplicateContainer.setContent(initPaginationContainer());
                    });
                    buildPagination();
                    success(control);
                }
                control.changePageSize = function (pageSize) {
                    if (initData.pageSize !== pageSize) {
                        initData.pageSize = pageSize;
                        initData.page = 1;
                        buildPagination();
                    }
                };
                control.changeTotal = function (total) {
                    if (initData.total !== total) {
                        initData.total = total;
                        buildPagination();
                    }
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);
