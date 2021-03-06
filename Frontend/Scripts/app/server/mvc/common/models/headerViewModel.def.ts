namespace Api.Common.Models {
    export interface IHeaderViewModel {
        phones: string[];
        headerLinks: Common.Models.ILinkViewModel[];
        logoPath: string;
        logoAlt: string;
        currencies: Common.Models.ICurrencyModel[];
        currentCurrency: Common.Models.ICurrencyModel;
        languages: Common.Models.ILanguageModel[];
        currentLanguage: Common.Models.ILanguageModel;
        comparedItemsCount: number;
        cartItemsCount: number;
        cart: Common.Models.ICartPopupModel;
        menu: Common.Models.IMenuViewModel;
        categoriesMenu: Common.Models.ICategoriesMenuViewModel;
        isLoggedIn: boolean;
    }
}