app.registerModule('Promise', [function () {
        'use strict';
        return {
            module: {
                create: function (success, error) {
                    return new window['Promise'](success, error);
                },
                result: function (promise) {
                    var promiseResult = {};
                    promise.then(function (result) {
                        promiseResult.result = result;
                        return result;
                    });
                    return promiseResult;
                },
                fromResult: function (obj) {
                    return this.create(function (success) {
                        success(obj);
                    });
                },
                all: function (promises, callback) {
                    if (!callback) {
                        return window['Promise'].all(promises);
                    }
                    window['Promise'].all(promises).then(function (results) {
                        callback.apply(null, results);
                    });
                },
                empty: function () {
                    return new window['Promise'](function (success) {
                        success();
                    });
                }
            },
            initComponent: function (component) {
                return component;
            }
        };
    }]);
