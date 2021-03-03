app.registerComponent('loader', 'UI', ['$', 'Promise', function ($: JQueryStatic, promise: IPromise) {
    'use strict';

    return {
        setLoader: function ($container) {
            $container.append('<i class="glyphicon glyphicon-refresh spinning tree-view-node-spinner font-20" />');
        },
        initOverlay: function ($container) {
            var control = {} as UI.ILoader,
                _$overlay;

            function getOverlay() {
                var $overlay = $('<div class="loading-overlay" />'),
                    $overlayInner = $('<div class="loading-overlay-inner" />'),
                    $span = $('<span class="loading-spinner" />');

                $span.append('<i class="glyphicon glyphicon-refresh spinning font-20" />');
                $overlay.append($overlayInner);
                $overlay.append($span);

                return $overlay;
            }

            control.show = function () {
                if (!_$overlay) {
                    _$overlay = getOverlay();
                    $container.addClass('loading-overlay-container').append(_$overlay);
                }
            };

            control.hide = function () {
                if (_$overlay) {
                    _$overlay.remove();
                    _$overlay = null;
                }

                $container.removeClass('loading-overlay-container');
            };

            return promise.create(function (success) {
                success(control);
            });
        }
    } as UI.ILoaderFactory;
}]);