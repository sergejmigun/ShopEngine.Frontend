app.registerComponent('optionsFilter', 'UI', [
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
                    $html.append(template);
                    container.setContent($html);
                    success(control);
                }
                return promise.create(function (success) {
                    templatesHtmlProvider.init('shopping').getHtml(['optionsFilter']).then(function (obj) {
                        app.ignoreParams(initData);
                        init(obj['optionsFilter'], success);
                    });
                });
            }
        };
    }
]);
