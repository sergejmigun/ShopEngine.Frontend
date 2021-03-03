namespace UI {
    export interface IFormInitData {
        container: JQuery;
        containerReady: Promise<any>;
        loader?: UI.ILoader;
    }

    export interface IFormSerializationRule<T> {
        (value: T): any;
    }

    export interface IFormInitControlResult2<T, TControl extends IInputControl<T>> {
        withValidation: (validatorName: string, validator: Services.IControlValidationFunc<T, TControl>) => IFormInitControlResult2<T, TControl>;
    }

    export interface IForm3InitControlResult<T, TControl extends IInputControl<T>> {
        withCustomSerialization: (serializationRule: IFormSerializationRule<T>) => IFormInitControlResult2<T, TControl>;
        withValidation: (validatorName: string, validator: Services.IControlValidationFunc<T, TControl>) => IFormInitControlResult2<T, TControl>;
    }

    export interface IForm {
        initSubmissionModelProperty(propName: string, value: (() => any) | any): void;

        initControl<T, TControl extends IInputControl<T>>(cssSelectorOrContainer: string | IContainer, controlInitializer: IInputControlInitializer<T, TControl>): IForm3InitControlResult<T, TControl>;
        initFormTemplate<TInModel, TTemplate extends Components.IFormTemplate<TInModel, any>>(cssSelectorOrContainer: string | IContainer, propName: string, templateInitializer: Components.ITemplateInitData<TInModel, TTemplate>): void;
        registerControl<T, TControl extends IInputControl<T>>(controlPromise: Promise<TControl>): IForm3InitControlResult<T, TControl>;

        clearValidation(control: UI.IInputControl<any>): void;
        validate(): Promise<any>;
        validateControl(control: UI.IInputControl<any>, targetValidatorNames?: string[]): void;

        submit<T>(submitAction: (submitModel: any) => Promise<T>): Promise<T>;
        reset(): void;
        serialize(): object;

        ready(): Promise<void>;
        hasUnsubmittedChanges(): boolean;
    }

    export interface IFormFactory {
        init(initData: IFormInitData): Promise<IForm>;
    }
}