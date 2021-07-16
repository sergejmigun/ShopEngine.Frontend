﻿app.registerComponent('cart', 'UI', [
    'Promise',
    'Services.templatesHtmlProvider',
    'Services.cartService',
    function (promise: IPromise,
        templatesHtmlProvider: Services.ITemplatesHtmlProviderFactory,
        cartService: Services.ICartService) {
        'use strict';

        return {
            init: function (container, initData) {
                var $html = $('<div />');
                var control: UI.ICart = {
                };

                function init(template, success) {
                    cartService.getCart().then(function (cart) {
                        var vm = new Vue({
                            data: {
                                cart: cart,
                                quantityInitData: {
                                    value: 10
                                }
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