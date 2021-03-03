namespace Services.Helpers {
    export interface IValidationHelper {
        getValidator<T, TControl extends UI.IInputControl<T>>(validationFunc: (value: T) => Promise<Services.ValidationStatus>, message: string): IControlValidationFunc<T, TControl>;
    }
}