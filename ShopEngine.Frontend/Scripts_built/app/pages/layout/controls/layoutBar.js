app.registerComponent('layoutBar', 'UI', [
    'Promise',
    'Services.templatesHtmlProvider',
    function (promise, templatesHtmlProvider) {
        'use strict';
        return {
            init: function (container, initData) {
                var $html = $('<div />');
                var control = {
                    addToCompareList: function (productId) {
                        app.ignoreParams(productId);
                    },
                    removeFromCompareList: function (productId) {
                        app.ignoreParams(productId);
                    },
                    setLanguage: function (code) {
                        app.ignoreParams(code);
                    },
                    setCurrency: function (code) {
                        app.ignoreParams(code);
                    },
                    addToCart: function (productId, count) {
                        app.ignoreParams(productId);
                        app.ignoreParams(count);
                    },
                    removeFromCart: function (productId, count) {
                        app.ignoreParams(productId);
                        app.ignoreParams(count);
                    },
                    updateCartItem: function (product) {
                        app.ignoreParams(product);
                    }
                };
                function init(template, success) {
                    var vm = new Vue({
                        data: initData,
                        template: template,
                        methods: {}
                    });
                    container.setContent($html);
                    vm.$mount($html[0]);
                    success(control);
                }
                templatesHtmlProvider.init('layout').getHtml(['layoutBar']).then(function (obj) {
                    return promise.create(function (success) {
                        init(obj['layoutBar'], success);
                    });
                });
            }
        };
    }
]);
