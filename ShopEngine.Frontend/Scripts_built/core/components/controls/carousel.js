app.registerComponent('carousel', 'UI', [
    '$',
    'Promise',
    'Collections',
    'Services.eventsInitializer',
    function ($, promise, collections, eventsInitializer) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper = $('<div class="carousel-wrapper"></div>'), _events = eventsInitializer.init(control, ['movingStart', 'movingEnd']), _items = [];
                function create$item(item) {
                    var $itemWrapper = $('<div class="carousel-item-wrapper"></div>');
                    $itemWrapper.append(item.content);
                    if (initData.minItemHeight) {
                        $itemWrapper.css('min-height', initData.minItemHeight);
                    }
                    if (initData.minItemWidth) {
                        $itemWrapper.css('min-width', initData.minItemWidth);
                    }
                    item.contentReady.then(function () {
                        $itemWrapper.removeAttr('style');
                    });
                    return $itemWrapper.wrap('<div></div>').parent();
                }
                function appendItem(item) {
                    _items.push(item);
                    var $itemWrapper = create$item(item);
                    _$wrapper.append($itemWrapper);
                }
                function slickRemove(index) {
                    _$wrapper['slick']('slickRemove', index);
                }
                function removeItem(index) {
                    slickRemove(index);
                    collections.removeByIndex(_items, index);
                }
                function init(success) {
                    if (initData.items) {
                        control.setItems(initData.items);
                    }
                    container.setContent(_$wrapper);
                    _$wrapper['slick']({
                        infinite: initData.infinite,
                        slidesToShow: initData.slides,
                        slidesToScroll: initData.slides,
                        variableWidth: initData.variableWidth,
                        dots: initData.dots,
                        arrows: initData.arrows
                    });
                    _$wrapper.on('beforeChange', function () {
                        _events.movingStart.invoke();
                    });
                    _$wrapper.on('afterChange', function () {
                        _events.movingEnd.invoke();
                    });
                    success(control);
                }
                control.addItem = function (item) {
                    _$wrapper['slick']('slickAdd', create$item(item));
                    _items.push(item);
                };
                control.removeItem = function (index) {
                    removeItem(index);
                };
                control.setItems = function (items) {
                    control.clearItems();
                    collections.foreach(items, function (item) {
                        appendItem(item);
                    });
                };
                control.clearItems = function () {
                    collections.repeat(_items.length, function () {
                        slickRemove(0);
                    });
                    collections.removeAll(_items);
                };
                control.destroy = function () {
                    _$wrapper['slick']('unslick');
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);
