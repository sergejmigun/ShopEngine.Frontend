app.registerComponent('tabs', 'UI', [
    '$',
    'Promise',
    'Services.eventsInitializer',
    'Collections',
    'UI',
    function ($, promise, eventsInitializer, collections, ui) {
        'use strict';
        return {
            init: function (container, initData) {
                var _$wrapper = $('<div class="tabs-wrapper" />'), _$headersWrapper = $('<ul class="nav nav-tabs" />'), _$contentsWrapper = $('<div class="tabs-contents-wrapper" />'), _activeTabData, _tabsData = [];
                var _events = {
                    onTabChanged: eventsInitializer.initEvent(),
                    onTabInit: eventsInitializer.initEvent()
                };
                var control = {
                    onTabChanged: _events.onTabChanged.event,
                    onTabInit: _events.onTabInit.event,
                    showTab: function (index) {
                        showTab(_tabsData[index]);
                    },
                    getActiveTabIndex: function () {
                        return initData.activeTabIndex;
                    },
                    addTab: function (tab, index) {
                        initTab(tab, index);
                    },
                    removeTab: function (index) {
                        _tabsData[index].remove();
                    }
                };
                function setTabContent(tabData) {
                    if (tabData.hasContent) {
                        return;
                    }
                    function complete(templateInst) {
                        tabData.hasContent = true;
                        tabData.tab.template = templateInst;
                        _events.onTabInit.invoke(tabData.tab);
                    }
                    return ui.renderItem(tabData.contentWrapper, container.ready(), tabData.tab.content).then(complete);
                }
                function showTab(tabData) {
                    if (_activeTabData) {
                        if (_activeTabData === tabData) {
                            return;
                        }
                        _activeTabData.tabHeader.removeClass('active');
                        _activeTabData.contentWrapper.hide();
                    }
                    tabData.tabHeader.addClass('active');
                    tabData.contentWrapper.show();
                    _activeTabData = tabData;
                    return setTabContent(tabData);
                }
                function initTab(tab, index) {
                    var $tabHeader = $('<li />'), $tabLink = $('<a href="#" />'), $contentWrapper = $('<div />'), tabData = {
                        tabHeader: $tabHeader,
                        contentWrapper: $contentWrapper,
                        tab: tab
                    };
                    tab.index = index;
                    _$contentsWrapper.append($contentWrapper);
                    _$headersWrapper.append($tabHeader);
                    $tabHeader.append($tabLink);
                    ui.renderItem($tabLink, container.ready(), tab.header, tab.headerText, true);
                    $tabHeader.click(function () {
                        _events.onTabChanged.invoke(tab);
                        initData.activeTabIndex = index;
                        showTab(tabData);
                        return false;
                    });
                    collections.insert(_tabsData, index, tabData);
                    if (initData.activeTabIndex === index) {
                        return showTab(tabData);
                    }
                    if (initData.loadAllContent) {
                        return setTabContent(tabData);
                    }
                }
                function setTabsPosition() {
                    if (initData.tabsPosition === UI.TabsPosition.Right || initData.tabsPosition === UI.TabsPosition.Left) {
                        _$headersWrapper.css('width', initData.tabWidth || 120 + 'px');
                        _$contentsWrapper.css('width', _$wrapper.outerWidth() - _$headersWrapper.outerWidth() - 20);
                        _$wrapper.addClass('tabs-' + initData.tabsPosition);
                    }
                }
                function init(success) {
                    _$wrapper.append(_$headersWrapper);
                    _$wrapper.append(_$contentsWrapper);
                    container.setContent(_$wrapper);
                    _$wrapper.append('<div class="clear" />');
                    setTabsPosition();
                    if (!initData.activeTabIndex) {
                        initData.activeTabIndex = 0;
                    }
                    collections.foreach(initData.tabs, function (tab, index) {
                        initTab(tab, index);
                    });
                    success(control);
                }
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);
