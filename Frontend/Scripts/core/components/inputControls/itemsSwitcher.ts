app.registerComponent('itemsSwitcher', 'UI', [
    '$',
    'Promise',
    'Collections',
    'Utils.objects',
    'UI.textRotator',
    'Services.containerHelper',
    'Services.eventsInitializer',
    function ($: JQueryStatic,
        promise: IPromise,
        collections: ICollections,
        objects: Utils.IObjects,
        textRotator: UI.ITextRotatorFactory,
        containerHelper: Services.IContainerHelper,
        eventsInitializer: Services.Initialization.IEventsInitializer) {
        'use strict';

        return {
            init: function (container, initData) {
                var _$wrapper: JQuery,
                    _textRotator: UI.ITextRotator;

                var _events = {
                    onChange: eventsInitializer.initVoidEvent(),
                    onRemove: eventsInitializer.initVoidEvent()
                };

                function getValue()
                {
                    var index = _textRotator.getCurrentItemIndex();

                    return initData.items[index].value;
                }

                function setValue(value: string) {
                    var index = collections.from(initData.items).indexOf(x => x.value === value);

                    if (index !== _textRotator.getCurrentItemIndex()) {
                        _textRotator.setCurrentItem(index);
                        _events.onChange.invoke();
                    }
                }

                function init(success) {
                    _$wrapper = $('<div class="items-switcher noselect" />');
                    container.setContent(_$wrapper);

                    var $inner = $('<div class="items-switcher-inner" />');

                    _$wrapper.append('<i class="fa fa-angle-left"></i>');
                    _$wrapper.append($inner);
                    _$wrapper.append('<i class="fa fa-angle-right"></i>');

                    if (initData.textWidth) {
                        $inner.css('width', initData.textWidth);
                    }

                    textRotator.init(containerHelper.appendTo($inner, container.ready()), {
                        items: collections.from(initData.items).select(x => x.text).toArray(),
                        rotateByClick: true,
                        rotateByMouseScroll: true,
                        $containerEl: _$wrapper,
                        currentItem: collections.from(initData.items).indexOf(x => x.value === initData.value)
                    }).then(function (control) {
                        _textRotator = control;

                        _textRotator.onBeforeRotate(() => {
                            _events.onChange.invoke();
                        });
                    });

                    success(control);
                }

                var control: UI.IItemsSwitcher = {
                    next: function () {
                        _textRotator.rotate();
                    },
                    prev: function () {
                        _textRotator.rotateBack();
                    },
                    getCurrentItem: function () {
                        var index = _textRotator.getCurrentItemIndex();

                        return objects.clone(initData.items[index]);
                    },
                    value: function (value) {
                        if (value !== undefined) {
                            setValue(value);
                        } else {
                            return getValue();
                        }
                    },
                    disabled: function (disabled) {
                        return disabled;
                    },
                    readOnly: function (readOnly) {
                        return readOnly;
                    },
                    displayError: function () { },
                    clearError: function () { },
                    clearAllErrors: function () { },
                    getAllErrors: function () { return []; },
                    onChange: _events.onChange.event,
                    getJQueryObject: function () {
                        return _$wrapper;
                    },
                    remove: function () { },
                    onRemove: _events.onRemove.event
                };

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as UI.IItemsSwitcherFactory;
    }
]);