app.registerComponent('layoutService', 'Services', [
    'Services.apiControllers.home.search',
    'Services.apiControllers.home.layout',
    function (
        searchController: Api.Layout.Controllers.ISearchController,
        layoutController: Api.Layout.Controllers.ILayoutController) {
        'use strict';

        var service: Layout.Services.ILayoutServicesService = {
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