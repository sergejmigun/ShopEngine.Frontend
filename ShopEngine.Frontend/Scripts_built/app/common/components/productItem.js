app.registerComponent('productItem', 'UI', [
    'Promise',
    'Utils.objects',
    'Services.templatesHtmlProvider',
    function (promise, objects, templatesHtmlProvider) {
        'use strict';
        return {
            init: function (container, initData) {
                var $html = $('<div />');
                var viewModel;
                var control = {};
                function getViewModel() {
                    viewModel = objects.clone(initData);
                    return viewModel;
                }
                function init(template, success) {
                    var vm = new Vue({
                        data: getViewModel(),
                        template: template,
                        methods: {
                            addToWishList: function () {
                            },
                            compareProduct: function () {
                            },
                            addToCart: function () {
                            }
                        }
                    });
                    container.setContent($html);
                    vm.$mount($html[0]);
                    success(control);
                }
                return promise.create(function (success) {
                    templatesHtmlProvider.init('common').getHtml(['productItem']).then(function (obj) {
                        app.ignoreParams(initData);
                        init(obj['productItem'], success);
                    });
                });
            }
        };
    }
]);
