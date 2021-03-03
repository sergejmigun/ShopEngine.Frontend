app.registerComponent('errorHandler', 'Services', [
    'Utils.objects',
    'Services.globalConfiguration',
    'Resources.UI',
    'UI.notifier',
    function (objects, globalConfiguration, resources, notifier) {
        'use strict';
        return {
            handle: function (response) {
                if (response.handled) {
                    return response;
                }
                var currentNotifier = notifier.getCurrent();
                if (currentNotifier) {
                    if (response.status === 400 && response.responseJSON) {
                        currentNotifier.notify(response.responseJSON.message, UI.INotificationType.Error);
                    }
                    else {
                        if (objects.tryGet(response.responseJSON, 'exceptionType') === globalConfiguration.clientExceptionTypeName) {
                            currentNotifier.notify(response.responseJSON.exceptionMessage, UI.INotificationType.Error);
                        }
                        else {
                            currentNotifier.notify(resources.unhandledErrorMessage, UI.INotificationType.Error);
                        }
                    }
                }
                response.handled = true;
                return response;
            }
        };
    }
]);
