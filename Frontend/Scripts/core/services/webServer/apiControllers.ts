app.registerComponent('apiControllers', 'Services', [
    'Services.apiService',
    'Services.webServer.controllersHelper',
    function (apiService: Services.IApiService,
        controllersHelper: Services.WebServer.IControllersHelper) {
        'use strict';

        var service = {};

        function getMethod(method) {
            if (!method) {
                method = 'get';
            }

            return method;
        }

        controllersHelper.init(service, 'api', function (actionData) {
            var method = getMethod(actionData.method);

            return function (data) {
                var result = {
                    url: actionData.url,
                    send: function () {
                        return apiService.sendRequestByUrl(actionData.url, data, method);
                    }
                };

                return result;
            };
        });

        return service;
    }
]);