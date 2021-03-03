app.registerComponent('event', 'Lib.objects', ['Collections', function (collections) {
        'use strict';
        return {
            init: function () {
                var ev = {}, store = [];
                ev.subscribe = function (handler, key) {
                    if (key) {
                        var handlerObj = {
                            handler: handler,
                            key: key
                        };
                        var index = collections.indexOf(store, function (item) {
                            return item.key === key;
                        });
                        if (index === -1) {
                            store[index] = handlerObj;
                        }
                        else {
                            store.push(handlerObj);
                        }
                    }
                    else {
                        store.push(handler);
                    }
                };
                ev.unsubscribe = function (key) {
                    if (key) {
                        collections.remove(store, function (item) {
                            return item.key === key;
                        });
                    }
                    else {
                        collections.removeAll(store);
                    }
                };
                ev.invoke = function () {
                    var i;
                    for (i = 0; i < store.length; i += 1) {
                        if (store[i].handler) {
                            store[i].handler.apply(null, arguments);
                        }
                        else {
                            store[i].apply(null, arguments);
                        }
                    }
                };
                return ev;
            }
        };
    }]);
