app.registerComponent('shopApp', 'Shared', [
    function () {
        'use strict';
        var component = {
            state: {
                currency: null,
                language: null
            }
        };
        return component;
    }
]);
