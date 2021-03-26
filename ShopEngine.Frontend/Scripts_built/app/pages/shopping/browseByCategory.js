app.registerComponent('BrowseByCategory', 'Pages', [
    'Promise',
    '$',
    'Services.containerHelper',
    'UI.priceRangeFilter',
    'UI.optionsFilter',
    function (promise, $, containerHelper, priceRangeFilter, optionsFilter) {
        'use strict';
        return {
            init: function (pageContext) {
                app.ignoreParams(pageContext);
                priceRangeFilter.init(containerHelper.appendTo($('#priceRange'), promise.empty()), {
                    min: 0,
                    max: 100,
                    rangeFrom: 10,
                    rangeTo: 25,
                    step: 1
                });
                optionsFilter.init(containerHelper.appendTo($('#optionsFilter'), promise.empty()), {
                    categoryOptions: [{
                            categoryName: 'Brands',
                            categoryId: 1,
                            options: [{
                                    id: 2,
                                    name: 'Apple',
                                    count: 23
                                }, {
                                    id: 3,
                                    name: 'Samsung',
                                    count: 24
                                }, {
                                    id: 4,
                                    name: 'Xiaomi',
                                    count: 25
                                }]
                        }, {
                            categoryName: 'TVs',
                            categoryId: 2,
                            options: [{
                                    id: 2,
                                    name: 'LG',
                                    count: 23
                                }, {
                                    id: 3,
                                    name: 'Qivi',
                                    count: 24
                                }, {
                                    id: 4,
                                    name: 'Philips',
                                    count: 25
                                }]
                        }]
                }).then(function (optionsFilter) {
                    optionsFilter.onChange(function (data) {
                        debugger;
                        app.ignoreParams(data);
                    });
                });
            }
        };
    }
]);
