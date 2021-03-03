app.registerComponent('backgroundProcessView', 'Components', [
    '$',
    'Promise',
    'Utils.objects',
    'Shared',
    'Services',
    function ($,
        promise,
        objects,
        shared,
        services) {
        'use strict';

        return {
            init: function (model, containerData) {
                var template = {},
                    _$html = $('<div />'),
                    _events = services.eventsInitializer.init(template, ['completed']);

                function initControl(success) {
                    var $wrapper = $('<div class="margin-b-20" />'),
                        url = shared.systemUrls.getBackgroundProcessInfoApiUrl + '?processId=' + model.processId;

                    _$html.append($wrapper);

                    services.apiService.get(url).then(function (bgProcess) {
                        var controlOptions = {
                            autoStart: model.autoStart,
                            getProgressUrl: shared.systemUrls.getBackgroundProcessProgressInfoApiUrl + '?processId=' + model.processId,
                            renderResult: function ($wrapper, result) {
                                $wrapper.append(result.message);
                            }
                        };

                        objects.map(bgProcess, controlOptions, ['processId', 'processTitle', 'cancelable', 'progressable', 'progressInfo']);

                        ui.backgroundProcessView.init($wrapper, controlOptions).then(function (backgroundProcessView) {
                            success(template);

                            backgroundProcessView.statusChanged(function (status) {
                                if (status > 1) {
                                    _events.completed.invoke(status);
                                }
                            });
                        });
                    });
                }

                function init(success) {
                    containerData.setContent(_$html);
                    initControl(success);
                }

                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);