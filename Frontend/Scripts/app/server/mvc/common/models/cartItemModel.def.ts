namespace Api.Common.Models {
    export interface ICartItemModel {
        product: Common.Models.IProductShortInfoModel;
        productsCount: number;
    }
}