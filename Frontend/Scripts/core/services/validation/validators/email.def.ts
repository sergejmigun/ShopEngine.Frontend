namespace Services.Validation {
    export interface IEmail {
        validate(value: string): Promise<Services.ValidationStatus>;
        init<T, TControl extends UI.IInputControl<T>>(message: string): IControlValidationFunc<T, TControl>;
    }
}