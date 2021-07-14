namespace Api.Account.Controllers {
    export interface ICartController {
        signIn(productId: number): Services.IWebResult<any>; 
        signOut(productId: number): Services.IWebResult<any>; 
    }
}