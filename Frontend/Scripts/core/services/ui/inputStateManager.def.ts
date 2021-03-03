namespace Services.Controls {
    export interface IInputStateManager {
        readOnly(readOnly: boolean): boolean;
        disabled(disabled: boolean): boolean;
        getValue(): any;
        setValue(value: any): void;
    }

    export interface IInputStateManagerFactory {
        init(innerInputs: UI_global.IInputControl<any>[], readOnlyState: boolean, disabledState: boolean): IInputStateManager;
    }
}