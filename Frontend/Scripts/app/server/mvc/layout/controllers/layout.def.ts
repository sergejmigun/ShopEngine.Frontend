namespace Web.Layout.Controllers {
    export interface ILayoutController {
        index(): Services.IWebResult<any>; 
        about(): Services.IWebResult<any>; 
        contact(): Services.IWebResult<any>; 
    }
}