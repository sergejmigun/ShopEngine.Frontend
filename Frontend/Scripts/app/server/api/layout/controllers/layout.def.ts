namespace Api.Layout.Controllers {
    export interface ILayoutController {
        getCategoriesMenu(): Services.IWebResult<Models.ICategoriesMenu>; 
    }
}