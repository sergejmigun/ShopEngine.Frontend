namespace Utils {
    export interface IMath {
        decimalRound(value, decimals): number;
    }
}

app.registerComponent('math', 'Utils', [
    function () {
        'use strict';

        return {
            decimalRound: function (value, decimals) {
                return Number(window['Math'].round(value + 'e' + decimals) + 'e-' + decimals);
            }
        } as Utils.IMath;
    }
]);