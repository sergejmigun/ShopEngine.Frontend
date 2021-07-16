namespace Api.Shopping.Controllers {
    export interface ICartController {
        getCart(): Services.IWebResult<Models.ICartModel>; 
        addCartItem(item: Models.ICartItem): Services.IWebResult<Models.ICartModel>; 
        updateCart(cart: Models.ICartModel): Services.IWebResult<Models.ICartModel>; 
    }
}