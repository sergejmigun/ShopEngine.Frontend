app.registerComponent('featuredProducts', 'UI', [
    'Promise',
    'Services.templatesHtmlProvider',
    function (promise, templatesHtmlProvider) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {};
                function init(template, success) {
                    container.setContent(template);
                    success(control);
                }
                return promise.create(function (success) {
                    templatesHtmlProvider.init('layout').getHtml(['featuredProducts']).then(function (obj) {
                        app.ignoreParams(initData);
                        init(obj['featuredProducts'], success);
                    });
                });
            }
        };
    }
]);
