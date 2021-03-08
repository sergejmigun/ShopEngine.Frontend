app.registerComponent('compareListService', 'Services', [
    'Promise',
    'Services.eventsInitializer',
    function (promise, eventsInitializer) {
        'use strict';
        var serviceEvents = {
            onChange: eventsInitializer.initEvent()
        };
        var compareListService = {
            onChange: serviceEvents.onChange.event,
            getCompareList: function () {
                return promise.fromResult({});
            },
            getItemsCount: function () {
                return promise.fromResult(99);
            }
        };
        return compareListService;
    }
]);
