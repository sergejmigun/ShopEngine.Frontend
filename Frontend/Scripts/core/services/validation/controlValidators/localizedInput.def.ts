namespace Services.Validation {
    export interface ILocalizedInput {
        validate(inputsList: UI.ILocalizedInput, validationFunc: (value: any) => Promise<Services.ValidationStatus>): Promise<Services.IValidationResult>;
    }
}