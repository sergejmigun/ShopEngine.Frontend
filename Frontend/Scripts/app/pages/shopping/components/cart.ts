app.registerComponent('cart', 'UI', [
    'Promise',
    'Collections',
    'Services.templatesHtmlProvider',
    'Services.cartService',
    function (promise: IPromise,
        collections: ICollections,
        templatesHtmlProvider: Services.ITemplatesHtmlProviderFactory,
        cartService: Services.ICartService) {
        'use strict';

        return {
            init: function (container, initData) {
                var $html = $('<div />');
                var control: UI.ICart = {
                };

                function recalculateSubtotal(cartVm) {
                    var subtotal = 0;

                    cartVm.items.forEach(function (item) {
                        if (item.control) {
                            subtotal += item.control.value();
                        }
                    });

                    cartVm.subtotal = subtotal;
                }

                function getCartViewModel(cart: Common.ICart) {
                    var cartVm = {
                        items: collections.from(cart.items).select(function (cartItem) {
                            var cartItemVm = {
                                item: cartItem,
                                controlInitData: {
                                    value: cartItem.product.price
                                },
                                control: null as UI.INumericBox,
                                inputReady: function (input: UI.INumericBox) {
                                    cartItemVm.control = input;

                                    input.onChange(function () {
                                         recalculateSubtotal(cartVm);
                                    });
                                },
                                remove: function () {
                                    collections.remove(cartVm.items, cartItemVm);
                                    recalculateSubtotal(cartVm);
                                }
                            };

                            return cartItemVm;
                        }).toArray(),
                        discountTotal: cart.discountTotal,
                        discountTotalStr: cart.discountTotalStr,
                        total: cart.total,
                        subtotal: cart.total,
                        removeAll: function () {
                            collections.removeAll(cartVm.items);
                            recalculateSubtotal(cartVm);
                        },
                        isEmpty: function () {
                            return cartVm.items.length === 0;
                        }
                    };

                    return cartVm;
                }

                function init(template, success) {
                    cartService.getCart().then(function (cart) {
                        var cartViewModel = getCartViewModel(cart);

                        var vm = new Vue({
                            data: {
                                cart: cartViewModel
                            },
                            template: template,
                            methods: {   
                            },
                            mounted: function () {
                            }
                        });

                        container.setContent($html);
                        vm.$mount($html[0]);
                        success(control);
                    });
                }

                return promise.create(function (success) {
                    templatesHtmlProvider.init('Shopping').getHtml(['cart']).then(function (obj) {
                        app.ignoreParams(initData);
                        init(obj['cart'], success);
                    });
                });
            }
        } as UI.ICartFactory;
    }
]);