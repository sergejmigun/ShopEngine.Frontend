namespace Api.Home.Controllers {
    export interface ILayoutController {
        getCategoriesMenu(): Services.IWebResult<Models.ICategoriesMenu>; 
    }
}