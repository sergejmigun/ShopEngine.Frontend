app.registerComponent('shopApp', 'Shared', [
    function () {
        'use strict';

        var component: Shared.IShopAppState = {
            state: {
                currency: null,
                language: null
            }
        };

        return component;
    }
]);