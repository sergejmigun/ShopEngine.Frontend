namespace Api.Auth.Controllers {
    export interface IAccountController {
        getAccountInfo(): Services.IWebResult<any>; 
    }
}