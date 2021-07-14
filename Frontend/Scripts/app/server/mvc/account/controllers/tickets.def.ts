namespace Web.Account.Controllers {
    export interface ITicketsController {
        browse(): Services.IWebResult<any>; 
        item(data: { id: number; }): Services.IWebResult<any>; 
    }
}