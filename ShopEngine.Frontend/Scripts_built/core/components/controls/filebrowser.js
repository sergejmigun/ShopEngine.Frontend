app.registerComponent('fileBrowser', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Services.eventsInitializer',
    function ($, promise, eventsInitializer) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _instance, _$wrapper = $('<div class="file-browser-container" />'), _events = eventsInitializer.init(control, ['load']);
                function init(success) {
                    container.setContent(_$wrapper);
                    var options = {
                        url: initData.url,
                        lang: 'en'
                    };
                    _instance = _$wrapper['elfinder'](options).elfinder('instance');
                    _instance.bind('init', function () {
                        success(control);
                    });
                    _instance.bind('load', function () {
                        _events.load.invoke();
                    });
                }
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);
