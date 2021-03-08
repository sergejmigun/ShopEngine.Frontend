app.registerComponent('compareListService', 'Services', [
    'Promise',
    'Services.eventsInitializer',
    function (promise: IPromise,
        eventsInitializer: Services.Initialization.IEventsInitializer) {
        'use strict';

        var serviceEvents = {
            onChange: eventsInitializer.initEvent<number>()
        };

        var compareListService: Services.ICompareListService = {
            onChange: serviceEvents.onChange.event,
            getCompareList: function () {
                return promise.fromResult<Common.ICompareList>({});
            },
            getItemsCount: function () {
                return promise.fromResult<number>(99);
            }
        };

        return compareListService;
    }
]);