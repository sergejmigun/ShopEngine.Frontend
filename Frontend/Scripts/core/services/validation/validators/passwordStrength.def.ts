namespace Services.Validation {
    export interface IPasswordStrength {
        init<T, TControl extends UI.IInputControl<T>>(message: string): IControlValidationFunc<T, TControl>;
    }
}