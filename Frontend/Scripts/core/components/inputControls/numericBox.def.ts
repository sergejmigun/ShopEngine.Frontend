namespace UI {
    export interface INumericBoxInitData extends IInputControlInitData<number> {
        min?: number;
        max?: number;
        nullable?: boolean;
        decimals?: number;
        hideButtons?: boolean;
        step?: number;
        width?: number;
    }

    export interface INumericBox extends IInputControl<number> {
    }

    export interface INumericBoxFactory extends IInputControlFactory<number, INumericBox, INumericBoxInitData> {
    }
}