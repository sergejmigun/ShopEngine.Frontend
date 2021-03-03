app.registerComponent('layoutService', 'Services', [
    'Services.apiControllers.home.search',
    'Services.apiControllers.home.layout',
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
