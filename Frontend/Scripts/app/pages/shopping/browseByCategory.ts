app.registerComponent('BrowseByCategory', 'Pages', [
    'Promise',
    '$',
    'Services.containerHelper',
    'UI.priceRangeFilter',
    'UI.optionsFilter',
    function (
        promise: IPromise,
        $: JQueryStatic,
        containerHelper: Services.IContainerHelper,
        priceRangeFilter: UI.IPriceRangeFilterFactory,
        optionsFilter: UI.IOptionsFilterFactory) {
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