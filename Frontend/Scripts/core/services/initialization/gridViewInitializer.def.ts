namespace Services.Initialization {
    export interface IGridViewFinalInitializerModel<TGridModel> extends Components_global.Grid.IGridViewModelBase {
        gridData: TGridModel;
    }

    export interface IGridViewFinalInitializer<TGridModel, TGridTemplate extends Components_global.Grid.IGridTemplate<TGridModel>> {
        init(initData: IGridViewFinalInitializerModel<TGridModel>, container: IContainer): Promise<Components.Grid.IGridView<TGridModel, TGridTemplate>>;
    }

    export interface IGridViewInitializer {
        for<TModel,TGridTemplate extends Components.Grid.IGridTemplate<TModel>> (gridFactory: Components.ITemplateFactory<Components_global.Grid.IGridModel<TModel>, TGridTemplate>): IGridViewFinalInitializer<TModel, TGridTemplate>;
    }
}