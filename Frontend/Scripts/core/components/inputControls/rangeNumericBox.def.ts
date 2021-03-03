namespace UI {
    export interface IRangeNumericBoxInitData extends IInputControlInitData<IRange> {
        from?: number;
        to?: number;
        max?: number;
        showSlider?: boolean;
        nullableFrom?: boolean;
        nullableTo?: boolean;
        decimals?: number;
    }

    export interface IRangeNumericBox extends IInputControl<IRange> {
    }

    export interface IRangeNumericBoxFactory extends IInputControlFactory<IRange, IRangeNumericBox, IRangeNumericBoxInitData> {
    }
}