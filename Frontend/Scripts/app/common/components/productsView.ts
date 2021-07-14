app.registerComponent('productsView', 'UI', [
    'Promise',
    'Services.eventsInitializer',
    'Services.templatesHtmlProvider',
    function (promise: IPromise,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        templatesHtmlProvider: Services.ITemplatesHtmlProviderFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var $html = $('<div />');

                var events = {
                    onSubmit: eventsInitializer.initVoidEvent()
                };

                var control: UI.IProductsView = {
                    onSubmit: events.onSubmit.event
                };

                function getProductItems() {
                    var items: Api.Shopping.Models.IProductItem[] = [];

                    items.push({
                        productId: 1,
                        isSale: true,
                        isOutOfStock: true,
                        productUrl: '',
                        productTitle: 'Iphone XS max',
                        productImgUrl: 'https://i2.rozetka.ua/goods/21382137/273090928_images_21382137518.jpg',
                        categoryName: 'Apple',
                        categoryId: 12,
                        priceStr: '12$',
                        price: 12,
                        oldPriceStr: '12$',
                        oldPrice: 13,
                        categoryUrl: ''
                    });

                    items.push({
                        productId: 1,
                        isSale: true,
                        isOutOfStock: true,
                        productUrl: '',
                        productTitle: 'Iphone XS max',
                        productImgUrl: 'https://i2.rozetka.ua/goods/21382137/273090928_images_21382137518.jpg',
                        categoryName: 'Apple',
                        categoryId: 12,
                        priceStr: '12$',
                        price: 12,
                        oldPriceStr: '12$',
                        oldPrice: 13,
                        categoryUrl: ''
                    });

                    items.push({
                        productId: 1,
                        isSale: true,
                        isOutOfStock: true,
                        productUrl: '',
                        productTitle: 'Iphone XS max',
                        productImgUrl: 'https://i2.rozetka.ua/goods/21382137/273090928_images_21382137518.jpg',
                        categoryName: 'Apple',
                        categoryId: 12,
                        priceStr: '12$',
                        price: 12,
                        oldPriceStr: '12$',
                        oldPrice: 13,
                        categoryUrl: ''
                    });

                    items.push({
                        productId: 1,
                        isSale: true,
                        isOutOfStock: true,
                        productUrl: '',
                        productTitle: 'Iphone XS max',
                        productImgUrl: 'https://i1.rozetka.ua/goods/13069901/spigen_065cs25312_images_13069901757.jpg',
                        categoryName: 'Apple',
                        categoryId: 12,
                        priceStr: '12$',
                        price: 12,
                        oldPriceStr: '12$',
                        oldPrice: 13,
                        categoryUrl: ''
                    });

                    items.push({
                        productId: 1,
                        isSale: true,
                        isOutOfStock: true,
                        productUrl: '',
                        productTitle: 'Iphone XS max',
                        productImgUrl: 'https://i1.rozetka.ua/goods/13069901/spigen_065cs25312_images_13069901757.jpg',
                        categoryName: 'Apple',
                        categoryId: 12,
                        priceStr: '12$',
                        price: 12,
                        oldPriceStr: '12$',
                        oldPrice: 13,
                        categoryUrl: ''
                    });

                    return items;
                }

                function init(template, success) {
                    var vm = new Vue({
                        data: {
                            pagination: {
                                pageSize: 20,
                                page: 1,
                                total: 300
                            },
                            productItems: getProductItems()
                        },
                        template: template,
                        methods: {
                            submit: function () {
                                events.onSubmit.invoke();
                            },
                            paginationReady: function (pagination: UI.IPagination) {
                                pagination.pageChanged(function (page) {
                                    app.ignoreParams(page);
                                    events.onSubmit.invoke();
                                });
                            }
                        }
                    });
                    
                    container.setContent($html);
                    vm.$mount($html[0]);
                    success(control);
                }

                return promise.create(function (success) {
                    templatesHtmlProvider.init('common').getHtml(['productsView']).then(function (obj) {
                        app.ignoreParams(initData);
                        init(obj['productsView'], success);
                    });
                });
            }
        } as UI.IProductsViewFactory;
    }
]);