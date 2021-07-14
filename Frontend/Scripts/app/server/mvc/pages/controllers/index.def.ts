namespace Web.Pages.Controllers {
    export interface IIndexController {
        index(data: { pageName: string; }): Services.IWebResult<any>; 
    }
}