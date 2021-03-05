namespace Api.Cart.Controllers {
    export interface ICartController {
        addItem(productId: number): Services.IWebResult<any>; 
        removeItem(productId: number): Services.IWebResult<any>; 
        updateCount(productId: number, count: number): Services.IWebResult<any>; 
    }
}