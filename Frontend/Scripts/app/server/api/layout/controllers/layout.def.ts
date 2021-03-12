namespace Api.Layout.Controllers {
    export interface ILayoutController {
        getCategoriesMenu(): Services.IWebResult<Models.ICategoriesMenu>; 
        setLanguage(languageCode: string): Services.IWebResult<any>; 
        setCurrency(currencyCode: string): Services.IWebResult<any>; 
        getFeaturedProductCategories(): Services.IWebResult<Models.IFeaturedProductCategory[]>; 
    }
}