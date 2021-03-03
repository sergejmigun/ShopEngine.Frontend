app.registerComponent('gridViewInitializer', 'Services', [
    'Utils.objects',
    'Components.gridView',
    function (objects, gridView) {
        'use strict';
        var _initializer = {
            for(gridFactory) {
                var finalInitializer = {
                    init: function (initData, container) {
                        var gridViewInitData = objects.clone(initData);
                        gridViewInitData.gridTemplateFactory = gridFactory;
                        return gridView.init(gridViewInitData, container);
                    }
                };
                return finalInitializer;
            }
        };
        return _initializer;
    }
]);
