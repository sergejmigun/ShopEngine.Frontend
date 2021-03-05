namespace Api.Features.Controllers {
    export interface ICompareListController {
        add(productId: number): Services.IWebResult<any>; 
        remove(productId: number): Services.IWebResult<any>; 
    }
}