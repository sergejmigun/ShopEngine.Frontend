namespace UI {
    export interface IAutoCompleterInitData extends IInputControlInitData<string> {
        placeholder: string;
        url: string;
    }

    export interface IAutoCompleter extends IInputControl<string> {
    }

    export interface IAutoCompleterFactory extends IInputControlFactory<string, IAutoCompleter, IAutoCompleterInitData> {
    }
}