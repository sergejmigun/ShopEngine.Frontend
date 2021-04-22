namespace UI {
    export interface IProductsViewInitData {
    }

    export interface IProductsView {
        onSubmit(handler: () => void): void;
    }

    export interface IProductsViewFactory {
        init(container: IContainer, initData: IProductsViewInitData): Promise<IProductsView>;
    }
}