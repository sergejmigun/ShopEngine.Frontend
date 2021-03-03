namespace UI {
    export interface IVariableInputData extends IInputControlInitData<object> {
        activeVariation: string;
        variations: { name: string; title: string }[];
        controlInitializer: UI.IInputControlInitializer<any, any>;
    }

    export interface IVariableInput extends IInputControl<object> {
        getCurrentVariation(): string;
        changeVariation(name: string): void;
    }

    export interface IVariableInputFactory extends IInputControlFactory<object, IVariableInput, IVariableInputData> {
    }
}