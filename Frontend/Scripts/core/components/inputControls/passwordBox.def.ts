namespace UI {
    export interface IPasswordBoxInitData extends IInputControlInitData<string> {
        maxLength: number;
    }

    export interface IPasswordBox extends IInputControl<string> {
    }

    export interface IPasswordBoxFactory extends IInputControlFactory<string, IPasswordBox, IPasswordBoxInitData> {
    }
}