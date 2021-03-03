app.registerComponent('urls', 'Utils', [
    '$',
    'Shared',
    'Utils.objects',
    function ($, shared, objects) {
        'use strict';
        return {
            getFullUrl: function (url, parameters) {
                var result = url;
                if (parameters) {
                    result += '?' + $.param(parameters);
                }
                return result;
            },
            navigate: function (url, parameters) {
                shared.window.location = this.getFullUrl(url, parameters);
            },
            setActionUrlHash: function (url, pushToStack) {
                var hash = '#action=' + url;
                shared.window.location.hash = hash;
                if (!pushToStack) {
                    shared.context.urlHashStore = [];
                }
                this.pushUrlHash(hash);
            },
            setParamsUrlHash: function (parameters, pushToStack) {
                var hash = '#params=' + $.param(parameters);
                if (!pushToStack) {
                    shared.context.urlHashStore = [];
                }
                this.pushUrlHash(hash);
            },
            createParamsHashString: function (parameters) {
                return '#params=' + $.param(parameters);
            },
            getParamsFromUrlHash: function () {
                var hash = shared.window.location.hash, result = null;
                if (hash && hash.startsWith("#params=")) {
                    var paramsStr = hash.substring(8);
                    result = $.deparam(paramsStr);
                }
                return result;
            },
            getParamFromUrlHash: function (paramName) {
                return objects.tryGet(this.getParamsFromUrlHash(), paramName);
            },
            addParamToUrlHash: function (name, value) {
                var params = this.getParamsFromUrlHash() || {};
                params[name] = value;
                this.setParamsUrlHash(params);
            },
            removeParamFromUrlHash: function (name) {
                var params = this.getParamsFromUrlHash() || {};
                if (params) {
                    delete params[name];
                    this.setParamsUrlHash(params);
                }
            },
            pushUrlHash: function (hash) {
                shared.context.urlHashStore.push(hash);
                shared.window.location.hash = hash;
            },
            popUrlHash: function () {
                shared.context.urlHashStore.pop();
                if (shared.context.urlHashStore.length) {
                    shared.window.location.hash = shared.context.urlHashStore[shared.context.urlHashStore.length - 1];
                }
                else {
                    shared.window.location.hash = '#none';
                }
            },
            clearUrlHash: function () {
                shared.context.urlHashStore = [];
                shared.window.location.hash = '#none';
            },
            addParam: function (url, name, value) {
                var paramSeparator = url.indexOf('?') !== -1
                    ? '&'
                    : '?';
                return url + paramSeparator + $.param([{
                        name: name,
                        value: value
                    }], true);
            },
            wrapArrayRequestAsSingle: function (arrayRequest) {
                return function (arg) {
                    return arrayRequest([arg]).then(function (request) {
                        if (request) {
                            return request[0];
                        }
                    });
                };
            }
        };
    }
]);
