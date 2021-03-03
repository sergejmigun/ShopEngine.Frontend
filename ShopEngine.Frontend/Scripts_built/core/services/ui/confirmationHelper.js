app.registerComponent('confirmationHelper', 'Services', [
    'Resources.UI',
    'Utils.strings',
    'UI.modals',
    function (resources, strings, modals) {
        'use strict';
        return {
            confirmDeletion: function (itemName) {
                return modals.confirm({
                    title: resources.confirmation,
                    message: strings.format(resources.confirmDeletion, itemName)
                });
            }
        };
    }
]);
