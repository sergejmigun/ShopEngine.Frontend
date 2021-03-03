app.registerComponent('controllersHelper', 'Services.webServer', [
    'Urls',
    'Collections',
    function (urls,
        collections: ICollections) {
        'use strict';

        var specialSymbol = '$';

        function initArea(groupedData: { key: string, items: INameValue<any>[] }, serviceInst: object, getAction: (actionData: Services.WebServer.IActionData) => (data) => void) {
            var area = {};

            serviceInst[groupedData.key] = area;
            collections.foreach(groupedData.items, function (controllerData) {
                var controller = {};

                area[controllerData.name] = controller;
                collections.foreach(controllerData.value as {}, function (actionData: Services.WebServer.IActionData, actionName) {
                    if (actionName.startsWith(specialSymbol)) {
                        return;
                    }

                    controller[actionName] = getAction(actionData);
                });
            });
        }

        return {
            init: function (serviceInst, type, getAction) {
                collections.fromObject(urls).where(function (urlData) {
                    return urlData.name === type;
                }).foreach(function (urlData) {
                    collections.fromObject(urlData.value as {}).where(function (data) {
                        return !data.name.startsWith(specialSymbol);
                    }).groupBy(function (data) {
                        return data.value['$area'];
                    }).foreach(function (groupedData) {
                        initArea(groupedData, serviceInst, getAction);
                    });
                });
            }
        } as Services.WebServer.IControllersHelper;
    }
]);