app.registerComponent('layoutService', 'Services', [
    'Services.apiControllers.layout.search',
    'Services.apiControllers.layout.layout',
    function (searchController, layoutController) {
        'use strict';
        var service = {
            search: function (query) {
                return searchController.search({
                    query: query
                }).send();
            },
            getCategoriesMenu: function () {
                return layoutController.getCategoriesMenu().send();
            }
        };
        return service;
    }
]);
