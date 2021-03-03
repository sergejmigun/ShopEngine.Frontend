app.registerComponent('webService', 'Services', [
    '$',
    'Urls',
    'Collections',
    'Shared',
    function ($: JQueryStatic,
        urls,
        collections: ICollections,
        shared) {
        'use strict';

        function getMethod(method) {
            if (!method) {
                method = 'get';
            } else if (method.toLowerCase() !== 'get') {
                method = 'post';
            }

            return method;
        }

        function navigate(url) {
            shared.window.location = url;
        }

        function getUrlParams(data) {
            if (data) {
                var params = $.param(data, true);

                if (params) {
                    return '?' + params;
                }
            }

            return '';
        }

        function sendGet(url, data) {
            navigate(url + getUrlParams(data));
        }

        function sendPost(url, data) {
            var $form = $('<form method="POST" />').attr('action', url).hide();

            collections.foreach(data as {}, function (value: any, name) {
                $form.append($('<input type="hidden" />').attr('name', name).val(value));
            });

            $('body').append($form);
            $form.submit();
        }

        function sendWebRequest(method, url, data) { 
            if (method === 'post') {
                sendPost(url, data);
            } else {
                sendGet(url, data);
            }
        }

        var service = {
            navigate: function (url) {
                navigate(url);
            },
            navigateToAction: function (controller, action, data) {
                var url = this.getUrl(controller, action, data);

                navigate(url);
            },
            getUrl: function (controller, action, data) {
                return urls.mvc[controller][action].url + getUrlParams(data);
            },
            getUrlParams: function (data) {
                return getUrlParams(data);
            },
            sendRequest: function (controller, action, data, method) {
                if (method === undefined) {
                    method = getMethod(urls[controller][action].method);
                }

                sendWebRequest(method, urls[controller][action].url, data);
            },
            sendRequestByUrl: function (url, data, method) {
                sendWebRequest(method, url, data);
            }
        } as Services.IWebService;

        collections.from(urls).where(function (urlData: any) {
            return urlData.name === 'mvc';
        }).foreach(function (urlData: any) {
            collections.foreach(urlData.value as {}, function (actionsData: any, controllerName) {
                if (controllerName === '$type') {
                    return;
                }

                service[controllerName] = {};

                collections.foreach(actionsData as {}, function (actionData: any, actionName) {
                    service[controllerName][actionName] = function (data) {
                        var method = getMethod(actionData.method);

                        sendWebRequest(method, actionData.url, data);
                    };
                });
            });
        });

        return service;
    }
]);