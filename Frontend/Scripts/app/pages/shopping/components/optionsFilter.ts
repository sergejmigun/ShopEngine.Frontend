app.registerComponent('optionsFilter', 'UI', [
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
                var control: UI.IOptionsFilter = {
                };

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
        } as UI.IOptionsFilterFactory;
    }
]);