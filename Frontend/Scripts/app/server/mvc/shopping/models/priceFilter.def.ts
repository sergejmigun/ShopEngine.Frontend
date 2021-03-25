namespace Api.Shopping.Models {
    export interface IPriceFilter {
        from: number;
        to: number;
        currencySign: string;
    }
}