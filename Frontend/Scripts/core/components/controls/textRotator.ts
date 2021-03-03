app.registerComponent('textRotator', 'UI', [
    '$',
    'Promise',
    'Services.eventsInitializer',
    function ($: JQueryStatic,
        promise: IPromise,
        eventsInitializer: Services.Initialization.IEventsInitializer) {
        'use strict';

        return {
            init: function (container, initData) {
                var _$wrapper = $('<span>'),
                    _currentItemInex = 0;

                var _events = {
                    onBeforeRotate: eventsInitializer.initEvent<number>(),
                    onRotated: eventsInitializer.initEvent<number>()
                };

                function rotateInner(index) {
                    function spin() {
                        _$wrapper.html("<span class='rotating spin' />").find(".rotating").hide().text(initData.items[index]).show().css({
                            "-webkit-transform": " rotate(0) scale(1)",
                            "-moz-transform": "rotate(0) scale(1)",
                            "-o-transform": "rotate(0) scale(1)",
                            "transform": "rotate(0) scale(1)"
                        });
                    }

                    function flip() {
                        _$wrapper.html("");
                        
                        $("<span class='front'>" + initData.items[_currentItemInex] + "</span>").appendTo(_$wrapper);
                        $("<span class='back'>" + initData.items[index] + "</span>").appendTo(_$wrapper);
                        _$wrapper.wrapInner("<span class='rotating' />").find(".rotating").hide().addClass("flip up").show().css({
                            "-webkit-transform": " rotateX(-180deg)",
                            "-moz-transform": " rotateX(-180deg)",
                            "-o-transform": " rotateX(-180deg)",
                            "transform": " rotateX(-180deg)"
                        });
                    }

                    switch (initData.rotationType) {
                        case UI.RotationType.Flip:
                            flip();
                            break;
                        case UI.RotationType.Spin:
                            spin();
                            break;
                        default:
                            flip();
                            break;
                    }

                    window.setTimeout(function () {
                        _events.onRotated.invoke(index);
                    }, 500);

                    _currentItemInex = index;
                    _events.onBeforeRotate.invoke(index);
                }

                function rotate(back: boolean) {
                    var index;

                    if (back) {
                        index = _currentItemInex === 0 ? initData.items.length - 1 : _currentItemInex - 1;
                    }
                    else {
                        index = _currentItemInex >= initData.items.length - 1 ? 0 : _currentItemInex + 1;
                    }

                    if (initData.inifiniteRotationInterval) {
                        window.setInterval(function () {
                            rotateInner(index);
                        }, initData.inifiniteRotationInterval)
                    } else {
                        rotateInner(index);
                    }
                }

                var control: UI.ITextRotator = {
                    rotate: function () {
                        rotate(false);
                    },
                    rotateBack: function () {
                        rotate(true);
                    },
                    getCurrentItemIndex: function () {
                        return _currentItemInex;
                    },
                    setCurrentItem: function (index) {
                        _currentItemInex = index;
                        _$wrapper.text(initData.items[index]);
                    },
                    onBeforeRotate: _events.onBeforeRotate.event,
                    onRotated: _events.onRotated.event
                };

                function init(success) {
                    container.setContent(_$wrapper);

                    if (initData.rotateByClick) {
                        (initData.$containerEl || _$wrapper).click(function () {
                            control.rotate();
                        });
                    }

                    if (initData.rotateByMouseScroll) {
                        (initData.$containerEl || _$wrapper).on('mousewheel', function () {
                            control.rotate();
                            
                            return false;
                        });
                    }

                    _currentItemInex = initData.currentItem || 0;

                    _$wrapper.text(initData.items[_currentItemInex]);
                    success(control);
                }

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as UI.ITextRotatorFactory;
    }
]);