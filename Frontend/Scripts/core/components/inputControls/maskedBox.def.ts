namespace UI {
    export interface IMaskedBoxInitData extends IInputControlInitData<string> {
        mask: string;
        maxLength: number;
    }

    export interface IMaskedBox extends IInputControl<string>  {
    }

    export interface IMaskedBoxFactory extends IInputControlFactory<string, IMaskedBox, IMaskedBoxInitData> {
    }
}