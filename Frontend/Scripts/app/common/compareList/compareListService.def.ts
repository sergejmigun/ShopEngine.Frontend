namespace Services {
    export interface ICompareListService {
        getCompareList(): Promise<Common.ICompareList>;
        getItemsCount(): Promise<number>;
        onChange(handler: (count: number) => void): void;
    }
}