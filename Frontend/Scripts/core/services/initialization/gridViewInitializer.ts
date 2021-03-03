app.registerComponent('gridViewInitializer', 'Services', [
    'Utils.objects',
    'Components.gridView',
    function (objects: Utils.IObjects,
        gridView: Components.Grid.IGridViewFactory<any, Components.Grid.IGridTemplate<any>>) {
        'use strict';

        var _initializer: Services.Initialization.IGridViewInitializer = {
            for<TGridModel, TGridTemplate extends Components_global.Grid.IGridTemplate<TGridModel>>(gridFactory) {
                var finalInitializer: Services.Initialization.IGridViewFinalInitializer<TGridModel, TGridTemplate> = {
                    init: function (initData, container) {
                        var gridViewInitData = objects.clone<any>(initData) as Components.Grid.IGridViewModel<TGridModel, TGridTemplate>;

                        gridViewInitData.gridTemplateFactory = gridFactory;

                        return gridView.init(gridViewInitData, container) as any;
                    }
                };

                return finalInitializer;
            }
        };

        return _initializer;
    }
]);