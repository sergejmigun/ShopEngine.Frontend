app.registerComponent('shopCatalogue', 'UI', [
    'Promise',
    'Utils.strings',
    'Services.templatesHtmlProvider',
    function (promise: IPromise,
        strings: Utils.IStrings,
        templatesHtmlProvider: Services.ITemplatesHtmlProviderFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var $html: JQuery;
                var topItems: { item: Api.Home.Models.ICategoriesMenuItem, $el: JQuery, focus: () => void }[] = [];

                function showSubItems(item: Api.Home.Models.ICategoriesMenuItem) {
                    var columns = [{
                        $col: $html.find('.itemsColumn1'),
                        count: 0
                    }, {
                        $col: $html.find('.itemsColumn2'),
                        count: 0
                    }, {
                        $col: $html.find('.itemsColumn3'),
                        count: 0
                    }];

                    function getColumn() {
                        return columns.sort(function (a, b) {
                            return a.count - b.count;
                        })[0];
                    }

                    item.subItems.forEach(function (subItem) {
                        var column = getColumn();
                        var $list = $('<ul />');
                        var $subitem = $('<li><strong><a></a></strong></li>');
                        $list.append($subitem);
                        $subitem.find('a').text(subItem.title).attr('href', subItem.url);
                        column.$col.append($list);
                        column.count += 1;

                        if (subItem.subItems) {
                            column.count += subItem.subItems.length;

                            subItem.subItems.forEach(function (subsubItem) {
                                var $subsubitem = $('<li><a></a></li>');
                                $subsubitem.find('a').text(subsubItem.title).attr('href', subsubItem.url);
                                $list.append($subsubitem);
                            });
                        }
                    });
                }

                function addTopItem(item: Api.Home.Models.ICategoriesMenuItem) {
                    var $topItemsList = $html.find('.topItemsList');
                    var $item = $('<li><span class="category-image img"></span><a></a><i class="nav fas fa-chevron-right"></i></li>')

                    $item.find('.img').css('background-image', strings.format('url({0})', item.iconUrl));
                    $item.find('a').text(item.title).attr('href', item.url);

                    $topItemsList.append($item);

                    var topItem = {
                        item: item,
                        $el: $item,
                        focus: function () {
                            $topItemsList.find('.focused').removeClass('focused');
                            $item.addClass('focused');
                            $html.find('.itemsColumn').html('');
                            showSubItems(item);
                        }
                    };

                    topItems.push(topItem);

                    return topItem;
                }

                function initTopCategories() {
                    initData.menu.topItems.forEach(function (item, i) {
                        var topItem = addTopItem(item);

                        if (i == 0) {
                            topItem.focus();
                        }
                    });
                }

                function init(success) {
                    container.setContent($html);
                    initTopCategories();
                    success();
                }

                templatesHtmlProvider.init().getHtml(['categoriesMenu']).then(function (obj) {
                    $html = $(obj['categoriesMenu']);
                    app.ignoreParams(initData);
                    return promise.create(function (success) {
                        init(success);
                    });
                });
            }
        } as UI.IShopCatalogueFactory;
    }
]);