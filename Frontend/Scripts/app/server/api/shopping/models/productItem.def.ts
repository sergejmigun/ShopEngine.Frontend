namespace Api.Shopping.Models {
    export interface IProductItem {
        productId: number;
        isSale: boolean;
        isOutOfStock: boolean;
        productUrl: string;
        productTitle: string;
        productImgUrl: string;
        categoryName: string;
        categoryUrl: string;
        categoryId: number;
        priceStr: string;
        price: number;
        oldPriceStr: string;
        oldPrice: number;
    }
}