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
    function (
        promise: IPromise,
        $: JQueryStatic,
        containerHelper: Services.IContainerHelper,
        //shopApp: Shared.IShopAppState,
        layoutService: Layout.Services.ILayoutServicesService,
        shopCatalogue: UI.IShopCatalogueFactory,
        layoutBar: UI.ILayoutBarFactory,
        featuredProducts: UI.IFeaturedProductsFactory,
        searchBar: UI.ISearchBarFactory) {
        'use strict';

        return {
            init: function (pageContext) {
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