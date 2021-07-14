namespace Web.Account.Controllers {
    export interface IListsController {
        compareList(): Services.IWebResult<any>; 
        wishlist(): Services.IWebResult<any>; 
    }
}