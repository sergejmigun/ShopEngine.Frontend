app.registerModule('Shared', [function () {
        'use strict';
        var context = this;
        if (!context.data) {
            context.data = {};
            context.module = {
                window: window,
                document: window.document,
                location: window.location
            };
        }
        return {
            module: context.module,
            initComponent: function (component, componentName) {
                if (!context.data.hasOwnProperty(componentName)) {
                    context.data[componentName] = component;
                }
                return context.data[componentName];
            }
        };
    }]);
