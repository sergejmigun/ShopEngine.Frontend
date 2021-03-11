app.registerComponent('featuredProducts', 'UI', [
    'Promise',
    'Services.templatesHtmlProvider',
    function (promise: IPromise,
        templatesHtmlProvider: Services.ITemplatesHtmlProviderFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var $html = $('<div />');
                var viewModel;
                var control: UI.IFeaturedProducts = {
                };

                function getViewModel() {
                    viewModel = {
                        featuredProductsCategoryName: 'Super',
                        productItems: [{
                            title: 'hello',
                            isSale: true,
                            isOutOfStock: false,
                            productUrl: '',
                            imgUrl: 'img/shop/products/02.jpg',
                            categoryName: '',
                            oldPriceStr: '',
                            priceStr: '20$'
                        }],
                        itemIsReady: function (ctrl) {
                            app.ignoreParams(ctrl);
                        }
                    };

                    return viewModel;
                }

                function init(template, success) {
                    var vm = new Vue({
                        data: getViewModel(),
                        template: template,
                        methods: {
                        }
                    });

                    container.setContent($html);
                    vm.$mount($html[0]);

                    success(control);
                }

                return promise.create(function (success) {

                    templatesHtmlProvider.init('home').getHtml(['featuredProducts']).then(function (obj) {
                        app.ignoreParams(initData);
                        init(obj['featuredProducts'], success);
                    });
                });
            }
        } as UI.IFeaturedProductsFactory;
    }
]);