app.registerComponent('localStorageService', 'Services', [
    'Shared',
    'Utils.objects',
    function (shared, objects) {
        'use strict';
        return {
            setItem: function (key, value) {
                if (value) {
                    if (!objects.isString(value)) {
                        value = objects.serializeToJson(value);
                    }
                }
                return shared.window.localStorage.setItem(key, value);
            },
            getString: function (key) {
                return shared.window.localStorage.getItem(key);
            },
            getObject: function (key, defaultValue) {
                var service = this;
                function getNoValue(value) {
                    if (!value) {
                        if (defaultValue) {
                            service.setItem(key, defaultValue);
                        }
                        return defaultValue;
                    }
                }
                var value = shared.window.localStorage.getItem(key);
                if (!value) {
                    return getNoValue(value);
                }
                try {
                    return objects.parseJson(value);
                }
                catch (ignore) {
                    this.removeItem(key);
                    return getNoValue(null);
                }
            },
            removeItem: function (key) {
                return shared.window.localStorage.removeItem(key);
            },
            clear: function () {
                return shared.window.localStorage.clear();
            }
        };
    }
]);
