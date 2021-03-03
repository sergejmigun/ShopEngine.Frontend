app.registerComponent('thumb', 'UI', [
    '$',
    'Promise',
    'Utils.urls',
    'Services.eventsInitializer',
    function ($: JQueryStatic,
        promise: IPromise,
        urls: Utils.IUrls,
        eventsInitializer: Services.Initialization.IEventsInitializer) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IThumb,
                    _$wrapper = $('<a class="pointer thumbnail no-margin-b" />'),
                    _$img = $('<img style="max-height: 70px;" />'),
                    _events = eventsInitializer.init(control, ['click']);

                function init(success) {
                    container.setContent(_$wrapper);
                    _$wrapper.append(_$img);

                    var src;

                    if (!initData.src && !initData.thumbFileName) {
                        src = '/Content/img/no_img.png';
                    } else {
                        src = urls.addParam(initData.src, 'thumb', 'true');
                    }

                    _$img.attr('src', src);

                    _$wrapper.click(function () {
                        _events.click.invoke();
                    });

                    success(control);
                }

                control.remove = function () {
                    _$wrapper.remove();
                };

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as UI.IThumbFactory;
    }
]);