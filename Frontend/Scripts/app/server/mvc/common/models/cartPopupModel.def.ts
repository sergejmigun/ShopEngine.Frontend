namespace Api.Common.Models {
    export interface ICartPopupModel {
        cartItems: Common.Models.ICartItemModel[];
        subtotal: number;
        subtotalStr: string;
    }
}