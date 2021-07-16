namespace Api.Shopping.Models {
    export interface ICartItem {
        product?: IProductItem;
        quantity?: number;
        discount?: number | void;
        discountStr?: string;
    }
}