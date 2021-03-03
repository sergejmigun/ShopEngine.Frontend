namespace UI {

    export interface ITypedInputInitData extends IInputControlInitData<any> {
        type: InputType;
        typeInitData?: any;
        localizableStrings?: boolean;
    }

    export interface ITypedInput extends IInputControl<any> {
        setType(type: InputType): Promise<IInputControl<any>>;
        onChange(handler: () => void): void;
        onRemove(handler: () => void): void;
    }

    export interface ITypedInputFactory extends IInputControlFactory<any, ITypedInput, ITypedInputInitData> {
    }
}