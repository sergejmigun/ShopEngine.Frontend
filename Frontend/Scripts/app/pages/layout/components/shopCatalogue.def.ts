namespace UI {
    export interface ICategoriesMenuItemViewModel {
        title: string,
        url: string,
        iconUrl?: string,
        subItems?: ICategoriesMenuItemViewModel[]
    }

    export interface ICategoriesMenuViewModel {
        items: ICategoriesMenuItemViewModel[],
        subItems1: ICategoriesMenuItemViewModel[],
        subItems2: ICategoriesMenuItemViewModel[],
        subItems3: ICategoriesMenuItemViewModel[]
        focusedItem: ICategoriesMenuItemViewModel;
    }

    export interface IShopCatalogueInitData {
        menu: Api.Home.Models.ICategoriesMenu;
    }

    export interface IShopCatalogue {
    }

    export interface IShopCatalogueFactory {
        init(container: IContainer, initData: IShopCatalogueInitData): Promise<IShopCatalogue>;
    }
}