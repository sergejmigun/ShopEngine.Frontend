app.registerComponent('notifierHelper', 'Services', [
    'Promise',
    'UI.notifier',
    'Resources.UI',
    function (promise: IPromise,
        notifier: UI.INotifierFactory,
        resources: Resources.UI) {
        'use strict';

        return {
            init: function () {
                var helper = {} as Services.Helpers.INotifierHelper,
                    _notifier = promise.result(notifier.init());

                helper.successfullyCreated = function (itemName) {
                    _notifier.result.notify(itemName + ' ' + resources.hasBeenSuccessfullyCreated);
                };

                helper.successfullyUpdated = function (itemName) {
                    _notifier.result.notify(itemName + ' ' + resources.hasBeenSuccessfullyUpdated);
                };

                helper.successfullyDeleted = function (itemName) {
                    _notifier.result.notify(itemName + ' ' + resources.hasBeenSuccessfullyDeleted);
                };

                return helper;
            }
        } as Services.Helpers.INotifierHelperFactory;
    }
]);