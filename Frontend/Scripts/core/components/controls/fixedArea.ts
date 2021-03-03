app.registerComponent('fixedArea', 'UI', [
    'Promise',
    function (promise: IPromise) {
        'use strict';

        return {
            init: function ($element, initData) {
                var control = {} as UI.IFixedArea;

                function init(success) {
                    control.fixArea();
                    success(control);
                }

                control.fixArea = function () {
                    var options = {} as any;

                    if (initData.bottom) {
                        options.bottom = 0;
                        options.limit = $element.offset().top;
                    } else {
                        options.marginTop = function () {
                            var paddingOfContent = 15; // see .content css
                            var footerHeight = 51; // footer height 50 + 1 for border

                            var marginTop = $(window).height() - $element.outerHeight(true) - paddingOfContent - footerHeight;

                            if (marginTop >= 0) {
                                return initData.marginTop;
                            }

                            return marginTop;
                        };
                    }

                    $element['scrollToFixed'](options);
                };

                control.unfixArea = function () {
                    $element.trigger('detach.ScrollToFixed');
                };

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as UI.IFixedAreaFactory;
    }
]);