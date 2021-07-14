app.registerComponent('addToCart', 'UI', [
    'Promise',
    'Services.templatesHtmlProvider',
    'Services.containerHelper',
    'UI.buttons',
    function (promise: IPromise,
        templatesHtmlProvider: Services.ITemplatesHtmlProviderFactory,
        containerHelper: Services.IContainerHelper,
        buttons: UI.IButtonsFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var $html = $('<div />');
                var control: UI.IAddToCart = {
                };

                function init(template, success) {
                    var quantityInput: UI.INumericBox;

                    var vm = new Vue({
                        data: {
                            quantityInitData: {
                                value: 1,
                                hideButtons: true
                            } as UI.INumericBoxInitData
                        },
                        template: template,
                        methods: {
                            quantityInputReady: function (input: UI.INumericBox) {
                                quantityInput = input;
                            }
                        },
                        mounted: function () {
                            var self = this;
                            var $element = $(self.$el as any);

                            buttons.doAction({
                                text: 'ADD TO CART',
                                css: 'btn btn-primary btn-block m-0 form-control',
                                iconCss: 'icon-shopping-cart mr-2',
                                action: function () {
                                    var val = quantityInput.value();

                                    app.ignoreParams(val);
                                    debugger
                                }
                            }, containerHelper.replace($element.find('.addToCartBtn'), promise.empty()))
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
        } as UI.IAddToCartFactory;
    }
]);