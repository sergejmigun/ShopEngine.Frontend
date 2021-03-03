app.registerComponent('popover', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    function ($, promise, objects) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _destroyed, _preventHidding, _$target, _state = 'hidden';
                function init(success) {
                    var popoverOptions = {
                        html: true
                    };
                    function hide() {
                        if (!_destroyed) {
                            control.hide();
                        }
                    }
                    _$target = $('<span />');
                    container.setContent(_$target);
                    objects.map(initData, popoverOptions, ['content', 'trigger', 'placement', 'title', {
                            container: {
                                def: 'body',
                                name: 'container'
                            }
                        }]);
                    _$target['popover'](popoverOptions);
                    _$target.on('hidden.bs.popover', function () {
                        _state = 'hidden';
                    });
                    _$target.on('shown.bs.popover', function () {
                        _state = 'shown';
                    });
                    if (initData.hideOnBodyClick) {
                        $(window).click(function () {
                            if (_preventHidding) {
                                _preventHidding = false;
                                return;
                            }
                            hide();
                        });
                    }
                    initData.content.click(function () {
                        _preventHidding = true;
                        if (initData.hideOnContentClick) {
                            hide();
                        }
                    });
                    success(control);
                }
                control.show = function () {
                    if (_state === 'hidden') {
                        _$target['popover']('show');
                    }
                };
                control.hide = function () {
                    if (_state === 'shown') {
                        _$target['popover']('hide');
                    }
                };
                control.destroy = function () {
                    _destroyed = true;
                    _$target['popover']('destroy');
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);
