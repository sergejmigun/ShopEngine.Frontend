app.registerComponent('notifier', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    function ($: JQuery,
        promise: IPromise,
        objects: Utils.IObjects) {
        'use strict';

        var _current: UI.INotifier;

        return {
            init: function (initData) {
                var control = {} as UI.INotifier;

                function init(success) {
                    _current = control;
                    success(control);
                }

                control.notify = function (message, type) {
                    if (!type) {
                        type = UI.INotificationType.Success;
                    }

                    var notifyOptions = {
                        type: type,
                        animate: {
                            enter: 'animated fadeInDown',
                            exit: 'animated fadeOutUp'
                        },
                        mouse_over: 'pause',
                        z_index: 1050
                    };

                    if (initData) {
                        objects.map(initData, notifyOptions, ['delay']);
                    }

                    $['notify']({
                        message: message
                    }, notifyOptions);
                };

                return promise.create(function (success) {
                    init(success);
                });
            },
            getCurrent: function () {
                return _current;
            },
            notify: function (message, type) {
                if (_current) {
                    _current.notify(message, type)
                } else {
                    this.init().then(function (notifier) {
                        notifier.notify(message, type);
                    });
                }
            }
        } as UI.INotifierFactory;
    }
]);