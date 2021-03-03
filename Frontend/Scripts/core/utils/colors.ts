namespace Utils {
    export interface IRgbResult {
        r: number;
        g: number;
        b: number;
    }

    export interface IColors {
        getRandomColor(): string;
        hexToRgb(hex: string): IRgbResult;
    }
}

app.registerComponent('colors', 'Utils', [
    function () {
        'use strict';

        return {
            getRandomColor: function () {
                var letters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
                    color = '#',
                    i;

                for (i = 0; i < 6; i += 1) {
                    color += letters[Math.floor(Math.random() * 16)];
                }

                return color;
            },
            hexToRgb: function (hex) {
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

                hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                    app.ignoreParams(m);

                    return r + r + g + g + b + b;
                });

                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

                if (result) {
                    return {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    };
                }

                return null;
            }
        } as Utils.IColors;
    }
]);