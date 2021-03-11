app.registerComponent('productItem', 'UI', [
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
                var viewModel: UI.IProductItemViewModel;
                var control: UI.IProductItem = {
                };

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
        } as UI.IProductItemFactory;
    }
]);