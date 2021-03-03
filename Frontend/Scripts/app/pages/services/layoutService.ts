app.registerComponent('layoutService', 'Services', [
    'Services.apiControllers.home.search',
    'Services.apiControllers.home.layout',
    function (
        searchController: Api.Home.Controllers.ISearchController,
        layoutController: Api.Home.Controllers.ILayoutController) {
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