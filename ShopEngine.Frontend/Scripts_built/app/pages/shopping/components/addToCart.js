app.registerComponent('addToCart', 'UI', [
    'Promise',
    'Services.templatesHtmlProvider',
    'Services.containerHelper',
    'UI.buttons',
    function (promise, templatesHtmlProvider, containerHelper, buttons) {
        'use strict';
        return {
            init: function (container, initData) {
                var $html = $('<div />');
                var control = {};
                function init(template, success) {
                    var quantityInput;
                    var vm = new Vue({
                        data: {
                            quantityInitData: {
                                value: 1,
                                hideButtons: true
                            }
                        },
                        template: template,
                        methods: {
                            quantityInputReady: function (input) {
                                quantityInput = input;
                            }
                        },
                        mounted: function () {
                            var self = this;
                            var $element = $(self.$el);
                            buttons.doAction({
                                text: 'ADD TO CART',
                                css: 'btn btn-primary btn-block m-0 form-control',
                                iconCss: 'icon-shopping-cart mr-2',
                                action: function () {
                                    var val = quantityInput.value();
                                    app.ignoreParams(val);
                                }
                            }, containerHelper.replace($element.find('.addToCartBtn'), promise.empty()));
                        }
                    });
                    container.setContent($html);
                    vm.$mount($html[0]);
                    success(control);
                }
                return promise.create(function (success) {
                    templatesHtmlProvider.init('Shopping').getHtml(['addToCart']).then(function (obj) {
                        app.ignoreParams(initData);
                        init(obj['addToCart'], success);
                    });
                });
            }
        };
    }
]);
