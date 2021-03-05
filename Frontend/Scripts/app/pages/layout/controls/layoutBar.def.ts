namespace UI {
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

    export interface ILayoutBarLanguage {
        code: string;
        shortTitle: string;
        title: string;
    }

    export interface ILayoutBarCurrency {
        code: string;
        sign: string;
        title: string;
    }

    export interface ILayoutBarInitData {
        cartItemsCount: number;
        comparedItemsCount: number;
        languages: ILayoutBarLanguage[];
        currencies: ILayoutBarCurrency[];
        currentLanguage: ILayoutBarLanguage;
        currentCurrency: ILayoutBarCurrency;
        cart: ICart;
    }

    export interface ILayoutBar {
        addToCompareList(productId: number): void;
        removeFromCompareList(productId: number): void;
        setLanguage(code: string): void;
        setCurrency(code: string): void;
        addToCart(productId: number, count: number);
        removeFromCart(productId: number, count: number);
        updateCartItem(product: IProductCartItem);
    }

    export interface ILayoutBarFactory {
        init(container: IContainer, initData: ILayoutBarInitData): Promise<ILayoutBar>;
    }
}