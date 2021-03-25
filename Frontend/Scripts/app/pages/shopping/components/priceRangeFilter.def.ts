namespace UI {
    export interface IPriceRangeFilterInitData {
        min: number;
        max: number;
        rangeFrom: number;
        rangeTo: number;
        step: number;
    }

    export interface IPriceRangeFilter {
    }

    export interface IPriceRangeFilterFactory {
        init(container: IContainer, initData: IPriceRangeFilterInitData): Promise<IPriceRangeFilter>;
    }
}