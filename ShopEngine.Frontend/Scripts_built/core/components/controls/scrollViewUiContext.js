app.registerComponent('scrollViewUiContext', 'Services.scrollView', [
    '$',
    'Promise',
    'UI.loader',
    'UI.buttons',
    'Services.containerHelper',
    'Services.eventsInitializer',
    function ($, promise, loader, buttons, containerHelper, eventsInitializer) {
        'use strict';
        return {
            init: function ($container, initData) {
                var context = {}, _$wrapper = $('<div class="scroll-wrapper" />'), _$olderDataActions, _$newerDataActions, _events = eventsInitializer.init(context, ['onContentChanged']);
                function initLoaders() {
                    var promises = [];
                    promises.push(loader.initOverlay(_$olderDataActions).then(function (inst) {
                        context.olderDataLoader = inst;
                    }));
                    promises.push(loader.initOverlay(_$newerDataActions).then(function (inst) {
                        context.newerDataLoader = inst;
                    }));
                    return promise.all(promises);
                }
                function init() {
                    _$wrapper.html($container.html());
                    $container.html('');
                    $container.append(_$wrapper);
                    _$olderDataActions = $('<div class="text-center" />');
                    _$newerDataActions = $('<div class="text-center" />');
                    if (initData.direction === UI.ScrollViewDirection.LatestOnBottom) {
                        _$wrapper.prepend(_$olderDataActions);
                        _$wrapper.append(_$newerDataActions);
                        context.addOlderData = function (content) {
                            _$olderDataActions.after(content);
                            _events.onContentChanged.invoke();
                        };
                        context.addNewerData = function (content) {
                            _$newerDataActions.before(content);
                            _events.onContentChanged.invoke();
                        };
                    }
                    else {
                        _$wrapper.prepend(_$olderDataActions);
                        _$wrapper.append(_$newerDataActions);
                        context.addOlderData = function (content) {
                            _$newerDataActions.after(content);
                        };
                        context.addNewerData = function (content) {
                            _$olderDataActions.before(content);
                        };
                    }
                    return initLoaders().then(function () {
                        return context;
                    });
                }
                context.clearActions = function () {
                    _$olderDataActions.html('');
                    _$newerDataActions.html('');
                };
                context.initLoadOlderDataButton = function (action) {
                    return buttons.cancel({
                        text: 'Load older data',
                        action: action
                    }, containerHelper.appendTo(_$olderDataActions, initData.containerReady));
                };
                context.initLoadNewerDataButton = function (action) {
                    return buttons.cancel({
                        text: 'Load newer data',
                        action: action
                    }, containerHelper.appendTo(_$newerDataActions, initData.containerReady));
                };
                context.toggleButtonVisibility = function ($button, isVisible) {
                    if (isVisible) {
                        $button.show();
                    }
                    else {
                        $button.hide();
                    }
                };
                context.initInfiniteScroll = function (onScroll) {
                    _$wrapper.wrap('<div class="infinite-scroll-wrapper" />');
                    var $p = _$wrapper.parent();
                    $p.on("scroll", function () {
                        var topOffset = $p.scrollTop(), bottomOffset = $p[0].scrollHeight - $p.height() - topOffset;
                        onScroll(topOffset, bottomOffset);
                    });
                };
                return init();
            }
        };
    }
]);
