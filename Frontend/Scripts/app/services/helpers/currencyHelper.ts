app.registerComponent('currencyHelper', 'Services', [
    'Utils.strings',
    function (strings: Utils.IStrings) {
    'use strict';

    return {
        showPrice: function (price) {
            return strings.format('{0} $', price);
        }
    } as Services.Helpers.ICurrencyHelper;
}]);