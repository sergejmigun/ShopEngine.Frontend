app.registerComponent('shopCatalogue', 'UI', [
    'Promise',
    'Collections',
    'Services.templatesHtmlProvider',
    function (promise, colections, templatesHtmlProvider) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {};
                var $html = $('<div />');
                var viewModel;
                function setSubItems(item) {
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
                function getItems(subItems) {
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
                function getViewModel() {
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
                        data: getViewModel(),
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
        };
    }
]);
