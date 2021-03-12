namespace Layout.Services {
    export interface ILayoutServicesService {
        search(query: string): Promise<any>;
        getCategoriesMenu(): Promise<Api.Layout.Models.ICategoriesMenu>;
        setCurrency(currencyCode: string): Promise<any>;
        setLanguage(languageCode: string): Promise<any>;
        getFeaturedProducts(): Promise<Api.Layout.Models.IFeaturedProductCategory[]>;
    }
}