app.registerComponent('currencyHelper', 'Services', [
    'Utils.strings',
    function (strings) {
        'use strict';
        return {
            showPrice: function (price) {
                return strings.format('{0} $', price);
            }
        };
    }
]);
