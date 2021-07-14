namespace UI {
    export interface IAddToCartInitData {
    }

    export interface IAddToCart {
    }

    export interface IAddToCartFactory {
        init(container: IContainer, initData: IAddToCartInitData): Promise<IAddToCart>;
    }
}