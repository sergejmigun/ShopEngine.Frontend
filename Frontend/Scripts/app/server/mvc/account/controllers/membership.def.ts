namespace Web.Account.Controllers {
    export interface IMembershipController {
        profile(): Services.IWebResult<any>; 
        passwordReset(): Services.IWebResult<any>; 
        registration(): Services.IWebResult<any>; 
    }
}