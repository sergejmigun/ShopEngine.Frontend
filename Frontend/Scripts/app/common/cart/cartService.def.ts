namespace Services {
    export interface ICartService {
        addItem(productId: number, count: number): Promise<any>;
        removeItem(productId: number): Promise<any>;
        updateCount(productId: number, count: number): Promise<any>;
        getCart(): Promise<Common.ICart>;
        onChange(handler: (cart: Common.ICart) => void): void;
    }
}