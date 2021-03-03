app.registerComponent('localization', 'Services', [function () {
        'use strict';
        return {
            getInputVariations: function () {
                return [{
                        name: 'en',
                        title: 'En'
                    }, {
                        name: 'ru',
                        title: 'Ru'
                    }];
            }
        };
    }]);
