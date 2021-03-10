namespace UI {
    export interface IFeaturedProductsInitData {
    }

    export interface IFeaturedProducts {
    }

    export interface IFeaturedProductsFactory {
        init(container: IContainer, initData: IFeaturedProductsInitData): Promise<IFeaturedProducts>;
    }
}