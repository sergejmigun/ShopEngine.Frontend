namespace UI {
    export interface ITextBoxinitData extends IInputControlInitData<string> {
        maxLength?: number;
        placeholder?: string;
        clearInput?: boolean;
    }

    export interface ITextBox extends IInputControl<string> {
        focus(): void;
        onChange(handler: () => void): void;
        onRemove(handler: () => void): void;
    }

    export interface ITextBoxFactory extends IInputControlFactory<string, ITextBox, ITextBoxinitData> {
    }
}