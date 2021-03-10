app.registerComponent('searchBar', 'UI', [
    'Promise',
    'Services.templatesHtmlProvider',
    'Services.layoutService',
    function (promise, templatesHtmlProvider, layoutService) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {};
                function init(template, success) {
                    var $html = $(template);
                    container.setContent($html);
                    $html.find('input[type=search]')['typeahead']({
                        minLength: 3,
                        highlight: true
                    }, {
                        name: 'ds',
                        source: function (query, syncResults, asyncResults) {
                            app.ignoreParams(query);
                            app.ignoreParams(syncResults);
                            layoutService.search(query).then(function (data) {
                                asyncResults(data);
                            });
                        },
                        async: true
                    });
                    success(control);
                }
                return promise.create(function (success) {
                    templatesHtmlProvider.init('layout').getHtml(['searchBar']).then(function (obj) {
                        app.ignoreParams(initData);
                        init(obj['searchBar'], success);
                    });
                });
            }
        };
    }
]);
