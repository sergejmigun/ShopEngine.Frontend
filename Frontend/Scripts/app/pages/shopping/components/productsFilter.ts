app.registerComponent('productsFilter', 'UI', [
    'Promise',
    'Utils.objects',
    'Services.templatesHtmlProvider',
    function (promise: IPromise,
        objects: Utils.IObjects,
        templatesHtmlProvider: Services.ITemplatesHtmlProviderFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var $html = $('<div />');
                var control: UI.IProductsFilter = {
                };

                function init(template, success) {
                    app.ignoreParams(objects);
                    app.ignoreParams(template);
                    container.setContent($html);
                    success(control);
                }

                return promise.create(function (success) {
                    templatesHtmlProvider.init('common').getHtml(['productsFilter']).then(function (obj) {
                        app.ignoreParams(initData);
                        init(obj['productsFilter'], success);
                    });
                });
            }
        } as UI.IProductsFilterFactory;
    }
]);