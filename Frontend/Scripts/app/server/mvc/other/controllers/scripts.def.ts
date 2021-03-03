namespace Web.Other.Controllers {
    export interface IScriptsController {
        resources(): Services.IWebResult<any>; 
        urls(): Services.IWebResult<any>; 
        context(pageModel: any): Services.IWebResult<any>; 
    }
}