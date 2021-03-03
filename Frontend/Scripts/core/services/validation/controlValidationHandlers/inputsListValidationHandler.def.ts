namespace Services.ValidationHandlers {
    export interface IInputsListValidationErrorData {
        index: number;
        message: string;
        data: any;
    }

    export interface IInputsListValidationError extends UI.IValidationError {
        data: IInputsListValidationErrorData[]
    }

    export interface IInputsListValidationHandler {
        displayError(error: IInputsListValidationError): void;
        getAllErrors(): string[];
        clearError(errorName: string): void;
        clearAllErrors(): void;
    }

    export interface IInputsListValidationHandlerFactory {
        init(control: UI.IInputsList<any>, $validationContainer: JQuery): IInputsListValidationHandler;
    }
}