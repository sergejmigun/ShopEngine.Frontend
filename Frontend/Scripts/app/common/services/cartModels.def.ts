namespace Common {
    export interface IProductCartItem {
        price: number;
        priceStr: string;
        productId: number;
        thumb: string;
        title: string;
    }

    export interface ICartItem {
        product: IProductCartItem;
        productsCount: number;
    }

    export interface ICart {
        cartItems: ICartItem[];
        subtotal: number;
        subtotalStr: string;
    }
}