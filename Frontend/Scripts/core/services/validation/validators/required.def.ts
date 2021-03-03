namespace Services.Validation {
    export interface IRequired {
        init<T, TControl extends UI.IInputControl<T>>(message: string): IControlValidationFunc<T, TControl>;
    }
}