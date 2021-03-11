app.registerComponent('vueJsComponentInitializer', 'Services', [
    'Promise',
    'Services.containerHelper',
    function (promise, containerHelper) {
        'use strict';
        var compareListService = {
            initUiComponents: function () {
                Object.getOwnPropertyNames(app['UI']).forEach(function (propName) {
                    try {
                        if (propName === 'renderItem') {
                            return;
                        }
                        Vue.component('UI-' + propName, {
                            props: ['initData', 'onReady'],
                            data: function () {
                                return {};
                            },
                            mounted: function () {
                                var controlFactory = app['UI'][propName];
                                if (!controlFactory.init) {
                                    return;
                                }
                                var self = this;
                                var initData = self.initData;
                                var $element = $(self.$el);
                                controlFactory.init(containerHelper.replace($element, promise.empty()), initData).then(function (component) {
                                    if (self.onReady) {
                                        self.onReady(component);
                                    }
                                    return component;
                                });
                            },
                            render: function (createElement) {
                                return createElement('div');
                            }
                        });
                    }
                    catch (ex) {
                        app.ignoreParams(ex);
                        debugger;
                    }
                });
            }
        };
        return compareListService;
    }
]);
