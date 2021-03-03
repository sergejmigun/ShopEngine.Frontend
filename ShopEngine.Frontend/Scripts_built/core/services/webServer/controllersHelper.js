app.registerComponent('controllersHelper', 'Services.webServer', [
    'Urls',
    'Collections',
    function (urls, collections) {
        'use strict';
        var specialSymbol = '$';
        function initArea(groupedData, serviceInst, getAction) {
            var area = {};
            serviceInst[groupedData.key] = area;
            collections.foreach(groupedData.items, function (controllerData) {
                var controller = {};
                area[controllerData.name] = controller;
                collections.foreach(controllerData.value, function (actionData, actionName) {
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
                    collections.fromObject(urlData.value).where(function (data) {
                        return !data.name.startsWith(specialSymbol);
                    }).groupBy(function (data) {
                        return data.value['$area'];
                    }).foreach(function (groupedData) {
                        initArea(groupedData, serviceInst, getAction);
                    });
                });
            }
        };
    }
]);
