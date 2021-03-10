app.registerComponent('layoutBar', 'UI', [
    'Promise',
    'Services.templatesHtmlProvider',
    'Services.layoutService',
    'Services.compareListService',
    'Services.cartService',
    function (promise: IPromise,
        templatesHtmlProvider: Services.ITemplatesHtmlProviderFactory,
        layoutService: Layout.Services.ILayoutServicesService,
        compareListService: Services.ICompareListService,
        cartService: Services.ICartService) {
        'use strict';

        return {
            init: function (container, initData) {
                var $html = $('<div />');
                var control: UI.ILayoutBar = {
                };

                function initModel(comparedItemsCount, cart: Common.ICart, template) {
                    var model: UI.ILayoutBarModel = {
                        cartItemsCount: cart.cartItems.length,
                        comparedItemsCount: comparedItemsCount,
                        languages: initData.languages,
                        currencies: initData.currencies,
                        currentLanguage: initData.currentLanguage,
                        currentCurrency: initData.currentCurrency,
                        cart: cart,
                        isLoggedIn: initData.isLoggedIn
                    };

                    var vm = new Vue({
                        data: model,
                        template: template,
                        methods: {
                            onSetCurrency: function () {
                                layoutService.setCurrency(model.currentCurrency.code);
                            },
                            onSetLanguage: function (code) {
                                model.currentLanguage.code = code;
                                layoutService.setLanguage(model.currentLanguage.code);
                            },
                            onRemoveCartItem: function () {
                                cartService.removeItem(1);
                            }
                        }
                    });

                    cartService.onChange(function (cart) {
                        model.cart = cart;
                    });

                    compareListService.onChange(function (count) {
                        model.comparedItemsCount = count;
                    });

                    container.setContent($html);
                    vm.$mount($html[0]);
                }

                function init(template, success) {
                    promise.all([compareListService.getItemsCount() as any,
                        cartService.getCart() as any])
                        .then(function (res) {
                            initModel(res[0], res[1] as any, template);
                            success(control);
                            return res;
                        });
                }
                return promise.create(function (success) {
                    templatesHtmlProvider.init('layout').getHtml(['layoutBar']).then(function (obj) {
                        app.ignoreParams(initData);

                        init(obj['layoutBar'], success);
                    });
                });
            }
        } as UI.ILayoutBarFactory;
    }
]);