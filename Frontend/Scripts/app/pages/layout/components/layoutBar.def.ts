namespace UI {
    export interface ILayoutBarModel {
        cartItemsCount: number;
        comparedItemsCount: number;
        languages: Common.ILanguage[];
        currencies: Common.ICurrency[];
        currentLanguage: Common.ILanguage;
        currentCurrency: Common.ICurrency;
        cart: Common.ICart;
        isLoggedIn: boolean;
    }

    export interface ILayoutBarInitData {
        languages: Common.ILanguage[];
        currencies: Common.ICurrency[];
        currentLanguage: Common.ILanguage;
        currentCurrency: Common.ICurrency;
        isLoggedIn: boolean;
    }

    export interface ILayoutBar {
    }

    export interface ILayoutBarFactory {
        init(container: IContainer, initData: ILayoutBarInitData): Promise<ILayoutBar>;
    }
}