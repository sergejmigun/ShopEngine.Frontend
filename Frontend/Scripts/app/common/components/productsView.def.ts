namespace UI {
    export interface IProductsViewInitData {
    }

    export interface IProductsView {
    }

    export interface IProductsViewFactory {
        init(container: IContainer, initData: IProductsViewInitData): Promise<IProductsView>;
    }
}