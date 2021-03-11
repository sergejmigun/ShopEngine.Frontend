namespace UI {
    export interface IProductItemViewModel extends IProductItemInitData {
    }

    export interface IProductItemInitData {
        productId: number;
        isSale: number;
        isOutOfStock: number;
        productUrl: number;
        productTitle: number;
        productImgUrl: number;
        categoryName: number;
        categoryId: number;
        priceStr: string;
        price: string;
        oldPriceStr?: string;
        oldPrice?: number;
    }

    export interface IProductItem {
    }

    export interface IProductItemFactory {
        init(container: IContainer, initData: IProductItemInitData): Promise<IProductItem>;
    }
}