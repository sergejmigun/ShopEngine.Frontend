app.registerComponent('pagination', 'UI', [
    'Promise',
    'Utils.objects',
    'Services.templatesHtmlProvider',
    function (promise, objects, templatesHtmlProvider) {
        'use strict';
        return {
            init: function (container, initData) {
                var $html = $('<div />');
                var control = {};
                function init(template, success) {
                    app.ignoreParams(objects);
                    app.ignoreParams(template);
                    container.setContent($html);
                    success(control);
                }
                return promise.create(function (success) {
                    templatesHtmlProvider.init('common').getHtml(['pagination']).then(function (obj) {
                        app.ignoreParams(initData);
                        init(obj['pagination'], success);
                    });
                });
            }
        };
    }
]);
