namespace UI {
    export interface IMultiLineTextBoxInitData extends IInputControlInitData<string> {
        maxLength?: number;
        height?: number;
        rows?: number;
        placeholder?: string;
        autosize?: boolean;
    }

    export interface IMultiLineTextBox extends IInputControl<string> {
    }

    export interface IMultiLineTextBoxFactory extends IInputControlFactory<string, IMultiLineTextBox, IMultiLineTextBoxInitData> {
    }
}