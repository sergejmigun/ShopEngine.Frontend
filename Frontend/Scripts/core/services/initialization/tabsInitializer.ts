app.registerComponent('tabsInitializer', 'Services.initialization', [
    'Promise',
    'UI.tabs',
    function (promise: IPromise,
        tabs: UI.ITabsFactory) {
        'use strict';

        return {
            initTabs: function (initData) {
                return promise.create(function (success) {
                    tabs.init(initData.container, {
                        tabs: initData.tabs,
                        activeTabIndex: initData.activeTabIndex
                    }).then(function (tabs) {
                        tabs.onTabInit(function () {
                            success(tabs);
                        });
                    });
                });
            }
        } as Services.Initialization.ITabsInitializer;
    }
]);