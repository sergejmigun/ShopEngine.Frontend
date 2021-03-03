app.registerComponent('notifierHelper', 'Services', [
    'Promise',
    'UI.notifier',
    'Resources.UI',
    function (promise, notifier, resources) {
        'use strict';
        return {
            init: function () {
                var helper = {}, _notifier = promise.result(notifier.init());
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
        };
    }
]);
