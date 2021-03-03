app.registerComponent('userInfo', 'Components', [function () {
        'use strict';
        return {
            init: function (model, containerData) {
                containerData.setContent('<div />');
                return model;
            }
        };
    }]);
