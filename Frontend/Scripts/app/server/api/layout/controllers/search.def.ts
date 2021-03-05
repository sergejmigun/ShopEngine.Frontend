namespace Api.Layout.Controllers {
    export interface ISearchController {
        search(query: Common.Models.ISearchRequest): Services.IWebResult<any>; 
    }
}