app.registerComponent('featuredProducts', 'UI', [
    'Promise',
    'Services.templatesHtmlProvider',
    'Services.layoutService',
    function (promise: IPromise,
        templatesHtmlProvider: Services.ITemplatesHtmlProviderFactory,
        layoutService: Layout.Services.ILayoutServicesService) {
        'use strict';

        return {
            init: function (container, initData) {
                var $html = $('<div />');
                var viewModel;
                var control: UI.IFeaturedProducts = {
                };

                function getViewModel(categories: Api.Layout.Models.IFeaturedProductCategory[]) {
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
                            methods: {
                            }
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
        } as UI.IFeaturedProductsFactory;
    }
]);