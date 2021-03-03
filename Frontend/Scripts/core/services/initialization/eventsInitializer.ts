app.registerComponent('eventsInitializer', 'Services', ['Utils.objects', function (objects) {
    'use strict';

    var eventsInitializer: Services.Initialization.IEventsInitializer = {
        init: function (object: any, events: string[]) {
            var eventsObj = {};

            function initEvent(i) {
                (function (i) {
                    var currentEventName = events[i],
                        currentEvent = objects.event();

                    eventsObj[currentEventName] = currentEvent;
                    object[currentEventName] = function (handler) {
                        currentEvent.subscribe(handler);
                    };
                }(i));
            }

            for (var i = 0; i < events.length; i += 1) {
                initEvent(i);
            }

            object.unbind = function (eventName) {
                if (eventsObj[eventName]) {
                    eventsObj[eventName].unsubscribe();
                }
            };

            return eventsObj;
        },
        initEvent: function () {
            var handlers: ((arg) => void)[] = [];

            return {
                event: function (handler) {
                    handlers.push(handler);
                },
                invoke: function () {
                    var args = arguments;

                    handlers.forEach(function (handler) {
                        handler.apply(this, args);
                    });
                }
            };
        },
        initVoidEvent: function () {
            var handlers: (() => void)[] = [];

            return {
                event: function (handler) {
                    handlers.push(handler);
                },
                invoke: function () {
                    handlers.forEach(function (handler) {
                        handler();
                    });
                }
            };
        }
    };

    return eventsInitializer;
}]);