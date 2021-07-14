namespace Api.Account.Controllers {
    export interface IAccountController {
        getAccountInfo(): Services.IWebResult<any>; 
    }
}