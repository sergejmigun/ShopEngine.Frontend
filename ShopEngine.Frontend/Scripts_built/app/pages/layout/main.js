app.registerComponent('Layout', 'Pages', [
    'Promise',
    '$',
    'Services.containerHelper',
    //'Shared.shopApp',
    'Services.layoutService',
    'UI.shopCatalogue',
    'UI.layoutBar',
    'UI.featuredProducts',
    function (promise, $, containerHelper, 
    //shopApp: Shared.IShopAppState,
    layoutService, shopCatalogue, layoutBar, featuredProducts) {
        'use strict';
        return {
            init: function (pageContext) {
                var $searchBar = $('#searchBar');
                //var $currenciesSelect = $('#currenciesSelect');
                //var $currencyLabel = $('#currencyLabel');
                //var $languageLabel = $('#languageLabel');
                //var $languageOptions = $('.languageOption');
                //var $currentLanguageImg = $('#currentLanguageImg');
                //function setCurrency() {
                //    shopApp.state.currency = $currenciesSelect.val() as string;
                //    $currencyLabel.text(shopApp.state.currency);
                //}
                //function setLanguage($img) {
                //    shopApp.state.language = $img.attr('code');
                //    var $newCurrentLanguageImg = $img.clone();
                //    $currentLanguageImg.replaceWith($newCurrentLanguageImg);
                //    $currentLanguageImg = $newCurrentLanguageImg;
                //    $languageLabel.text(shopApp.state.language);
                //}
                $searchBar['typeahead']({
                    minLength: 3,
                    highlight: true
                }, {
                    name: 'my-dataset',
                    source: function (query, syncResults, asyncResults) {
                        app.ignoreParams(query);
                        app.ignoreParams(syncResults);
                        layoutService.search(query).then(function (data) {
                            asyncResults(data);
                        });
                    },
                    async: true
                });
                //$currenciesSelect.change(function () {
                //    setCurrency();
                //});
                //$languageOptions.click(function () {
                //    var $img = $(this).find('img');
                //    setLanguage($img);
                //});
                //shopApp.state.language = $currentLanguageImg.attr('code');
                featuredProducts.init(containerHelper.appendTo($('#featuredProducts'), promise.empty()), {});
                //setCurrency();
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
