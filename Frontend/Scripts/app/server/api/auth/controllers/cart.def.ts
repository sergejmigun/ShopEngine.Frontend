namespace Api.Auth.Controllers {
    export interface ICartController {
        signIn(productId: number): Services.IWebResult<any>; 
        signOut(productId: number): Services.IWebResult<any>; 
    }
}