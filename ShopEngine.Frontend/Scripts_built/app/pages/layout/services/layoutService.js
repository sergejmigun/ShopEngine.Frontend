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
            },
            setCurrency: function (currencyCode) {
                return layoutController.setCurrency(currencyCode).send();
            },
            setLanguage: function (languageCode) {
                return layoutController.setLanguage(languageCode).send();
            },
            getFeaturedProducts: function () {
                return layoutController.getFeaturedProductCategories().send();
            }
        };
        return service;
    }
]);
