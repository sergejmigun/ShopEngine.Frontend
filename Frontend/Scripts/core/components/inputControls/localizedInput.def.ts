namespace UI {
    export interface ILocalizedValueItem {
        language: string;
        value: string;
    }

    export interface ILocalizedValue {
        items: ILocalizedValueItem[];
    }

    export interface ILanguageData {
        name: string;
        title: string;
    }

    export interface ILocalizedInputInitData extends IInputControlInitData<ILocalizedValue> {
        controlInitializer: UI.IInputControlInitializer<any, any>;
        type?: string;
    }

    export interface ILocalizedInput extends IInputControl<ILocalizedValue> {
        changeLanguage(language: string): void;
    }

    export interface ILocalizedInputFactory extends IInputControlFactory<ILocalizedValue, ILocalizedInput, ILocalizedInputInitData> {
    }
}