namespace Api.Common.Models {
    export interface IProductItem {
        productId: number;
        isSale: boolean;
        isOutOfStock: boolean;
        productUrl: string;
        productTitle: string;
        productImgUrl: string;
        categoryName: string;
        categoryId: number;
        priceStr: string;
        price: number;
        oldPriceStr: string;
        oldPrice: number;
    }
}