namespace Web.Common.Controllers {
    export interface IHomeController {
        index(): Services.IWebResult<any>; 
        about(): Services.IWebResult<any>; 
        contact(): Services.IWebResult<any>; 
    }
}