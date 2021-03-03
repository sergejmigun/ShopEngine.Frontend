namespace Services.Validation {
    export interface IInputslist {
        validate(
            inputsList: UI.IInputsList<any>,
            message: string,
            validationFunc: (value: any) => Promise<Services.ValidationStatus>,
            validateControl: (control: UI.IInputControl<any>) => Promise<Services.IValidationResult>): Promise<Services.IValidationResult>;
    }
}