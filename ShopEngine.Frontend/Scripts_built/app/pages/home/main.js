app.registerComponent('Layout', 'Pages', [
    'Promise',
    '$',
    'Services.containerHelper',
    //'Shared.shopApp',
    'Services.layoutService',
    'UI.shopCatalogue',
    'UI.layoutBar',
    'UI.featuredProducts',
    'UI.searchBar',
    function (promise, $, containerHelper, 
    //shopApp: Shared.IShopAppState,
    layoutService, shopCatalogue, layoutBar, featuredProducts, searchBar) {
        'use strict';
        return {
            init: function (pageContext) {
                debugger;
                searchBar.init(containerHelper.appendTo($('#searchBarWrapper'), promise.empty()), {});
                featuredProducts.init(containerHelper.appendTo($('#featuredProducts'), promise.empty()), {});
                layoutService.getCategoriesMenu().then(function (menu) {
                    shopCatalogue.init(containerHelper.appendTo($('#categoriesMenu'), promise.empty()), {
                        menu: menu
                    });
                });
                layoutBar.init(containerHelper.replace($('#layoutToolbar'), promise.empty()), pageContext.model.header);
            }
        };
    }
]);
