app.registerComponent('featuredProducts', 'UI', [
    'Promise',
    'Services.templatesHtmlProvider',
    'Services.layoutService',
    function (promise, templatesHtmlProvider, layoutService) {
        'use strict';
        return {
            init: function (container, initData) {
                var $html = $('<div />');
                var viewModel;
                var control = {};
                function getViewModel(categories) {
                    viewModel = {
                        featuredProductCategories: categories
                    };
                    return viewModel;
                }
                function init(template, success) {
                    layoutService.getFeaturedProducts().then(function (categories) {
                        var vm = new Vue({
                            data: getViewModel(categories),
                            template: template,
                            methods: {}
                        });
                        container.setContent($html);
                        vm.$mount($html[0]);
                        success(control);
                    });
                }
                return promise.create(function (success) {
                    templatesHtmlProvider.init('home').getHtml(['featuredProducts']).then(function (obj) {
                        app.ignoreParams(initData);
                        init(obj['featuredProducts'], success);
                    });
                });
            }
        };
    }
]);
