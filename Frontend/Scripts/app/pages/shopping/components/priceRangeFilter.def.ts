namespace UI {
    export interface IPriceRangeFilterInitData {
        min: number;
        max: number;
        rangeFrom: number;
        rangeTo: number;
        step: number;
    }

    export interface IPriceRangeFilter {
        onSubmit(handler: (rangeFrom: number, rangeTo: number) => void): void;
    }

    export interface IPriceRangeFilterFactory {
        init(container: IContainer, initData: IPriceRangeFilterInitData): Promise<IPriceRangeFilter>;
    }
}