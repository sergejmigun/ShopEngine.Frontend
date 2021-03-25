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
                optionsFilter.init(containerHelper.appendTo($('#optionsFilter'), promise.empty()), {});
            }
        };
    }
]);
