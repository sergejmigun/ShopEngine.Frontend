app.registerComponent('dropDownMenu', 'UI', [
    '$',
    'Promise',
    'Collections',
    'Services.eventsInitializer',
    function ($: JQueryStatic,
        promise: IPromise,
        collections: ICollections,
        eventsInitializer: Services.Initialization.IEventsInitializer) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IDropDownMenu,
                    _$wrapper = $('<div />'),
                    _events = eventsInitializer.init(control, ['itemClick']);

                function initClick($item, item: UI.IDropDownMenuButtonData) {
                    $item.click(function (e) {
                        e.preventDefault();

                        if (item.disabled) {
                            return;
                        }

                        if (item.action) {
                            item.action(item.data);
                        }

                        _events.itemClick.invoke(item.data);
                    });
                }

                function appendButtonIcon($button, data) {
                    if (data.iconCss) {
                        var $i = $('<i />').addClass(data.iconCss);

                        if (data.iconColorCss) {
                            $i.addClass(data.iconColorCss);
                        }

                        $button.append($i);
                    }
                }

                function buildDropDownToggleButton() {
                    var customHtml = '<a data-toggle="dropdown" />',
                        defaultHtml = '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" data-placement="top">' +
                            '<span class="caret" /></button >';

                    var $button;

                    if (initData.customDropDownToggleButtonHtml) {
                        $button = $(customHtml).html(initData.customDropDownToggleButtonHtml);
                    } else {
                        $button = $(defaultHtml);
                    }

                    if (initData.dropDownToggleButtonCss) {
                        $button.addClass(initData.dropDownToggleButtonCss);
                    }

                    _$wrapper.append($button);
                }

                function buildMenu($wrapper, items) {
                    function buildItem($wrapper, item) {
                        var $itemWrapper = $('<li role="menuitem" />'),
                            $itemButton = $('<a href="#" />');

                        if (item.url) {
                            $itemButton.attr('href', item.url);
                        } else {
                            initClick($itemButton, item);
                        }

                        appendButtonIcon($itemButton, item);
                        $itemButton.append(item.text);
                        $itemWrapper.append($itemButton);
                        $wrapper.append($itemWrapper);

                        if (item.items) {
                            $itemWrapper.addClass('dropdown-submenu');
                            buildMenu($itemWrapper, item.items);
                        }

                        if (item.disabled) {
                            $itemWrapper.addClass('disabled');
                        }
                    }

                    if (items.length) {
                        var $ul = $('<ul role="menu" />');
                        $wrapper.append($ul);
                        $ul.addClass('dropdown-menu');

                        if (initData.position === UI.DropDownMenuPostion.right) {
                            $ul.addClass('pull-right');
                        }

                        buildDropDownToggleButton();

                        _$wrapper.addClass('btn-group dropdown btn-group-' + (initData.size || 'sm'));

                        collections.foreach(items as any[], function (item) {
                            if (item.divider) {
                                $ul.append('<li class="divider" />');
                            } else {
                                buildItem($ul, item);
                            }
                        });
                    }
                }

                function buildCurrentButton() {
                    var $item = $('<button type="button" class="btn btn-default" />');

                    $item.addClass('btn-' + (initData.size || 'sm'));
                    appendButtonIcon($item, initData.currentItemButton);
                    $item.append(initData.currentItemButton.text);
                    _$wrapper.append($item);
                    initClick($item, initData.currentItemButton);
                }

                function init(success) {
                    if (initData.currentItemButton) {
                        buildCurrentButton();
                    }

                    buildMenu(_$wrapper, initData.items);

                    container.setContent(_$wrapper);
                    success(control);
                }

                control.remove = function () {
                    _$wrapper.remove();
                };

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as UI.IDropDownMenuFactory;
    }
]);