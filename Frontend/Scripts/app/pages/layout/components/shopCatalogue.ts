app.registerComponent('shopCatalogue', 'UI', [
    'Promise',
    'Collections',
    'Services.templatesHtmlProvider',
    function (promise: IPromise,
        colections: ICollections,
        templatesHtmlProvider: Services.ITemplatesHtmlProviderFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var control: UI.IShopCatalogue = {};
                var $html = $('<div />');
                var viewModel: UI.ICategoriesMenuViewModel;

                function setSubItems(item: UI.ICategoriesMenuItemViewModel) {
                    var columns = [viewModel.subItems1, viewModel.subItems2, viewModel.subItems3];

                    function getColumn() {
                        return columns.sort(function (a, b) {
                            return a.length - b.length;
                        })[0];
                    }

                    columns.forEach(function (arr) {
                        colections.removeAll(arr);
                    });

                    item.subItems.forEach(function (subItem) {
                        var column = getColumn();

                        column.push(subItem);
                    });
                }

                function getItems(subItems: Api.Home.Models.ICategoriesMenuItem[]) {
                    if (!colections.hasItems(subItems)) {
                        return;
                    }

                    return colections.from(subItems).select(function (item) {
                        return {
                            title: item.title,
                            url: item.url,
                            iconUrl: item.iconUrl,
                            subItems: getItems(item.subItems)
                        };
                    }).toArray();
                }

                function getVueData() {
                    viewModel = {
                        items: getItems(initData.menu.topItems),
                        subItems1: [],
                        subItems2: [],
                        subItems3: [],
                        focusedItem: null
                    };

                    viewModel.focusedItem = viewModel.items[0];
                    setSubItems(viewModel.focusedItem);

                    return viewModel;
                }

                function init(template, success) {
                    var vm = new Vue({
                        data: getVueData(),
                        template: template,
                        methods: {
                            onItemHover: function (item) {
                                viewModel.focusedItem = item;
                                setSubItems(item);
                            }
                        }
                    });

                    container.setContent($html);
                    vm.$mount($html[0]);

                    success(control);
                }

                templatesHtmlProvider.init('layout').getHtml(['categoriesMenu']).then(function (obj) {
                    app.ignoreParams(initData);
                    return promise.create(function (success) {
                        init(obj['categoriesMenu'], success);
                    });
                });
            }
        } as UI.IShopCatalogueFactory;
    }
]);