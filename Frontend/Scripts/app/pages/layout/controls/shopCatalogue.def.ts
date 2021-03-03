namespace UI {
    export interface IShopCatalogueInitData {
        menu: Api.Home.Models.ICategoriesMenu;
    }

    export interface IShopCatalogue {
    }

    export interface IShopCatalogueFactory {
        init(container: IContainer, initData: IShopCatalogueInitData): Promise<IShopCatalogue>;
    }
}