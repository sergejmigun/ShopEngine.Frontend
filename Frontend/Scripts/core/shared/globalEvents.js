app.registerComponent('globalEvents', 'Shared', [
    'Services.eventsInitializer',
    function (eventsInitializer) {
        'use strict';

        var component = {},
            _events = eventsInitializer.init(component, ['toggleLanguage', 'onAddDomElement']);

        component.invoke = function (eventName) {
            _events[eventName].invoke();
        };

        return component;
    }
]);