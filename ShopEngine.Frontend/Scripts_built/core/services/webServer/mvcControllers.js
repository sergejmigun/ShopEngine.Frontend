app.registerComponent('mvcControllers', 'Services', [
    'Services.webService',
    'Services.webServer.controllersHelper',
    function (webService, controllersHelper) {
        'use strict';
        var service = {};
        controllersHelper.init(service, 'mvc', function (actionData) {
            return function (data) {
                var url = actionData.url;
                if (!actionData.method || actionData.method.toLowerCase() === 'get') {
                    url += webService.getUrlParams(data);
                }
                var result = {
                    url: url,
                    send: function () {
                        webService.sendRequestByUrl(actionData.url, data, actionData.method);
                    }
                };
                return result;
            };
        });
        return service;
    }
]);
