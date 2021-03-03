namespace UI {
    export interface IRange {
        from: number;
        to: number;
    }

    export interface IRangeSliderInitData extends IInputControlInitData<IRange> {
        from: number;
        to: number;
        maxLength?: number;
    }

    export interface IRangeSlider extends IInputControl<IRange> {
    }

    export interface IRangeSliderFactory extends IInputControlFactory<IRange, IRangeSlider, IRangeSliderInitData> {
    }
}