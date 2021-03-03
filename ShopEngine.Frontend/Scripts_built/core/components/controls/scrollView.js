app.registerComponent('scrollView', 'UI', [
    'Promise',
    'Collections',
    'Services.eventsInitializer',
    'Services.scrollView.scrollViewUiContext',
    function (promise, collections, eventsInitializer, uiContext) {
        'use strict';
        return {
            init: function (contentProvider, initData) {
                var control = {}, _hasOlderData, _hasNewerData, _pageContents = [], _scrollViewUiContext, _maxPages = initData.maxPages || 5, _events = eventsInitializer.init(control, ['onContentChanged', 'onPageCleared']), _controlContext;
                function getOldestToken() {
                    var last = collections.last(_pageContents);
                    if (last) {
                        return last.tokens.first;
                    }
                }
                function getNewestToken() {
                    var first = collections.first(_pageContents);
                    if (first) {
                        return first.tokens.last;
                    }
                }
                function initDefaultControlContext() {
                    _controlContext = {
                        afterDataLoad: function () {
                            return;
                        }
                    };
                }
                function loadOlderData() {
                    _scrollViewUiContext.olderDataLoader.show();
                    return initData.loadPage(getOldestToken(), true).then(function (pageContent) {
                        _pageContents.push(pageContent);
                        if (_pageContents.length > _maxPages) {
                            collections.foreach(_pageContents.slice(0, _pageContents.length - _maxPages), function (pageContent) {
                                pageContent.content.remove();
                                collections.remove(_pageContents, pageContent);
                                _events.onPageCleared.invoke(pageContent);
                            });
                            _hasNewerData = true;
                        }
                        _hasOlderData = pageContent.hasMoreData;
                        _scrollViewUiContext.olderDataLoader.hide();
                        _controlContext.afterDataLoad();
                        _scrollViewUiContext.addOlderData(pageContent.content);
                    });
                }
                function loadNewerData() {
                    _scrollViewUiContext.newerDataLoader.show();
                    return initData.loadPage(getNewestToken(), false).then(function (pageContent) {
                        collections.insert(_pageContents, 0, pageContent);
                        if (_pageContents.length > _maxPages) {
                            collections.foreach(_pageContents.slice(_maxPages - _pageContents.length), function (pageContent) {
                                pageContent.content.remove();
                                collections.remove(_pageContents, pageContent);
                                _events.onPageCleared.invoke(pageContent);
                            });
                            _hasOlderData = true;
                        }
                        _hasNewerData = pageContent.hasMoreData;
                        _scrollViewUiContext.newerDataLoader.hide();
                        _controlContext.afterDataLoad();
                        _scrollViewUiContext.addNewerData(pageContent.content);
                    });
                }
                function initLoadMoreButton() {
                    var addNewerDataButton = _scrollViewUiContext.initLoadNewerDataButton(), addOlderDataButton = _scrollViewUiContext.initLoadOlderDataButton();
                    addNewerDataButton.click(function () {
                        loadNewerData();
                    });
                    addOlderDataButton.click(function () {
                        loadOlderData();
                    });
                    if (!_hasNewerData) {
                        addNewerDataButton.hide();
                    }
                    if (!_hasOlderData) {
                        addOlderDataButton.hide();
                    }
                    _controlContext = {
                        afterDataLoad: function () {
                            _scrollViewUiContext.toggleButtonVisibility(addNewerDataButton, _hasNewerData);
                            _scrollViewUiContext.toggleButtonVisibility(addOlderDataButton, _hasOlderData);
                        }
                    };
                }
                function initInfiniteScroll() {
                    var isLoadingTop = false, isLoadingBottom = false;
                    _scrollViewUiContext.initInfiniteScroll(function (topOffset, bottomOffset) {
                        if (!isLoadingTop && topOffset <= 50) {
                            if (_hasOlderData) {
                                isLoadingTop = true;
                                loadOlderData().then(function () {
                                    isLoadingTop = false;
                                });
                            }
                        }
                        if (!isLoadingBottom && bottomOffset <= 50) {
                            if (_hasNewerData) {
                                isLoadingBottom = true;
                                loadNewerData().then(function () {
                                    isLoadingBottom = false;
                                });
                            }
                        }
                    });
                }
                function loadInitialData() {
                    return loadOlderData().then(function () {
                        if (initData.loadMoreButton) {
                            initLoadMoreButton();
                        }
                        else {
                            initInfiniteScroll();
                        }
                    });
                }
                function init(success) {
                    uiContext.init(contentProvider.getContent(), {
                        direction: initData.direction,
                        containerReady: initData.containerReady
                    }).then(function (context) {
                        _scrollViewUiContext = context;
                        initDefaultControlContext();
                        _scrollViewUiContext.onContentChanged(function () {
                            _events.onContentChanged.invoke();
                        });
                        loadInitialData().then(function () {
                            success(control);
                        });
                    });
                }
                control.refresh = function () {
                    _hasOlderData = false;
                    _hasNewerData = false;
                    _scrollViewUiContext.clearActions();
                    var currentPageContents = collections.from(_pageContents).select(function (pageContent) {
                        return pageContent.content;
                    }).toArray();
                    _pageContents = [];
                    var currentAddOlderDataFunc = _scrollViewUiContext.addOlderData;
                    _scrollViewUiContext.addOlderData = function (content) {
                        collections.foreach(currentPageContents, function (currentContent) {
                            currentContent.remove();
                        });
                        currentAddOlderDataFunc(content);
                    };
                    return loadInitialData().then(function () {
                        _scrollViewUiContext.addOlderData = currentAddOlderDataFunc;
                    });
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);
