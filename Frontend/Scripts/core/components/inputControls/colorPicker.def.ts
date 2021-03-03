namespace UI {
    export interface IColorPickerInitData extends IInputControlInitData<string> {
        mode: CodeEditorMode;
    }

    export interface IColorPicker extends IInputControl<string> {
    }

    export interface IColorPickerFactory extends IInputControlFactory<string, IColorPicker, IColorPickerInitData> {
    }
}