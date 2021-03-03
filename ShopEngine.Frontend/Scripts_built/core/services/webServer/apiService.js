app.registerComponent('apiService', 'Services', [
    '$',
    'Promise',
    'Urls',
    'Services',
    'Collections',
    'Utils.objects',
    'Utils.strings',
    'Components.common.errorViewer',
    'Shared',
    function ($, promise, urls, services, collections, objects, strings, errorViewer, shared) {
        'use strict';
        function logError(errorData) {
            var responseData = errorData.responseJSON, modalHelper = services.modalHelper, componentInitializationHelper = services.componentInitializationHelper;
            if (!responseData) {
                return;
            }
            if (errorData.status === 400) {
                return;
            }
            modalHelper.open({
                title: responseData.message,
                template: componentInitializationHelper.forTemplate(errorViewer, {
                    errorData: responseData
                })
            });
        }
        function getMethod(method) {
            if (!method) {
                method = 'get';
            }
            return method;
        }
        function sendApiRequest(url, data, method, dataType) {
            var contentType;
            if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put') {
                contentType = 'application/json';
                data = objects.serializeToJson(data);
            }
            if (method.toLowerCase() === 'delete') {
                url = url + '?' + $.param(data, true);
                data = undefined;
            }
            return promise.create(function (success, error) {
                $.ajax({
                    url: url,
                    type: method,
                    data: data,
                    success: success,
                    cache: false,
                    contentType: contentType,
                    error: function (data) {
                        logError(data);
                        error(data);
                    },
                    dataType: dataType
                });
            });
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
        var service = {
            get: function (url, data) {
                return sendApiRequest(url, data, 'GET', 'json');
            },
            getHtml: function (url, data) {
                return sendApiRequest(url, data, 'GET', 'html');
            },
            getTemplateHtml: function (templateName, area) {
                var self = this, baseUrl = '/Content/Templates/', templatesStorage = shared.context.templatesStorage, templateId = strings.format('{0}_{1}', templateName, area || '');
                if (area) {
                    baseUrl += area + '/';
                }
                if (!templatesStorage.hasOwnProperty(templateId)) {
                    templatesStorage[templateId] = self.getHtml(baseUrl + templateName + '.html', {});
                }
                return templatesStorage[templateId];
            },
            post: function (url, data) {
                return sendApiRequest(url, data, 'POST', 'json');
            },
            put: function (url, data) {
                return sendApiRequest(url, data, 'PUT', 'json');
            },
            delete: function (url, data) {
                return sendApiRequest(url + getUrlParams(data), undefined, 'DELETE', 'json');
            },
            getUrl: function (controller, action, data) {
                return urls.api[controller][action].url + getUrlParams(data);
            },
            sendRequest: function (controller, action, data, method) {
                if (method === undefined) {
                    method = getMethod(urls[controller][action].method);
                }
                return sendApiRequest(urls[controller][action].url, data, method, 'json');
            },
            sendRequestByUrl: function (url, data, method) {
                return sendApiRequest(url, data, method, 'json');
            }
        };
        collections.fromObject(urls).where(function (urlData) {
            return urlData.name === 'api';
        }).foreach(function (urlData) {
            collections.foreach(urlData.value, function (actionsData, controllerName) {
                if (controllerName === '$type') {
                    return;
                }
                service[controllerName] = {};
                collections.foreach(actionsData, function (actionData, actionName) {
                    if (actionName === '$area') {
                        return;
                    }
                    service[controllerName][actionName] = function (data) {
                        var method = getMethod(actionData.method);
                        return sendApiRequest(actionData.url, data, method, 'json');
                    };
                });
            });
        });
        return service;
    }
]);
