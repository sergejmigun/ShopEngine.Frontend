namespace Api.Shopping.Models {
    export interface ICartModel {
        items?: ICartItem[];
        discountTotal?: number | void;
        discountTotalStr?: string;
        total?: number;
    }
}