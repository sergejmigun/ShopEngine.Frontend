namespace UI {
    export interface ICheckBoxInitData extends IInputControlInitData<boolean> {
        nullable?: boolean;
        label?: string;
        trueText?: string;
        falseText?: string;
        notSetText?: string;
        trueTextCss?: string;
        falseTextCss?: string;
        notSetTextCss?: string;
    }

    export interface ICheckBox extends IInputControl<boolean> {
    }

    export interface ICheckBoxFactory extends IInputControlFactory<boolean, ICheckBox, ICheckBoxInitData> {
    }
}