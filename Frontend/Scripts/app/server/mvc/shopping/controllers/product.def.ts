namespace Web.Shopping.Controllers {
    export interface IProductController {
        index(data: { id: number; }): Services.IWebResult<any>; 
    }
}