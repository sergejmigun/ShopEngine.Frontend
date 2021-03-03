namespace Services {
    export interface IDefaultInputValidationHandler {
        displayError(error: UI.IValidationError): void;
        getAllErrors(): string[];
        clearError(errorName: string): void;
        clearAllErrors(): void;
    }

    export interface IDefaultInputValidationHandlerFactory {
        init(control: UI.IInputControl<any>): IDefaultInputValidationHandler;
    }
}