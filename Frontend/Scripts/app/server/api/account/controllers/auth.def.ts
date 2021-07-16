namespace Api.Account.Controllers {
    export interface IAuthController {
        signIn(productId: number): Services.IWebResult<any>; 
        signOut(productId: number): Services.IWebResult<any>; 
    }
}