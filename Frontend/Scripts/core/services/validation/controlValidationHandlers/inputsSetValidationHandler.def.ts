namespace Services.ValidationHandlers {
    export interface IInputsSetValidationErrorData {
        name: string;
        message: string;
        data: any;
    }

    export interface IInputsSetValidationError extends UI.IValidationError {
        data: IInputsSetValidationErrorData[]
    }

    export interface IInputsSetValidationHandler {
        displayError(error: IInputsSetValidationError): void;
        getAllErrors(): string[];
        clearError(errorName: string): void;
        clearAllErrors(): void;
    }

    export interface IInputsSetValidationHandlerFactory {
        init(control: UI.IInputsSet): IInputsSetValidationHandler;
    }
}