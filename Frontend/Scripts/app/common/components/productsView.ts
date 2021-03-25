app.registerComponent('productsView', 'UI', [
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
                var control: UI.IProductsView = {
                };

                function init(template, success) {
                    app.ignoreParams(objects);
                    app.ignoreParams(template);
                    container.setContent($html);
                    success(control);
                }

                return promise.create(function (success) {
                    templatesHtmlProvider.init('common').getHtml(['productsView']).then(function (obj) {
                        app.ignoreParams(initData);
                        init(obj['productsView'], success);
                    });
                });
            }
        } as UI.IProductsViewFactory;
    }
]);