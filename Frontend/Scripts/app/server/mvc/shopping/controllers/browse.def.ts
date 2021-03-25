namespace Web.Shopping.Controllers {
    export interface IBrowseController {
        category(data: { categoryId: number | void; }): Services.IWebResult<any>; 
    }
}