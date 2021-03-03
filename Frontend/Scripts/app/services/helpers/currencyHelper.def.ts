namespace Services.Helpers {
    export interface ICurrencyHelper {
        showPrice(price: number): string;
    }
}