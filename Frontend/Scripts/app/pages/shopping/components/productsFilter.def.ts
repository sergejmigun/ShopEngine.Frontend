namespace UI {
    export interface IProductsFilterInitData {
    }

    export interface IProductsFilter {
    }

    export interface IProductsFilterFactory {
        init(container: IContainer, initData: IProductsFilterInitData): Promise<IProductsFilter>;
    }
}