namespace Services.Validation {
    export interface IInputsSet {
        validate(
            inputsSet: UI.IInputsSet,
            message: string,
            validationFunc: (value: any) => Promise<Services.ValidationStatus>,
            validateControl: (control: UI.IInputControl<any>) => Promise<Services.IValidationResult>): Promise<Services.IValidationResult>;
    }
}