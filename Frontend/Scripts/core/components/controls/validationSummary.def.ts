namespace UI {
    export interface IValidationSummaryInitData {
        messageGetter?: (data: any) => string;
        scrollToControl?: boolean;
    }

    export interface IValidationSummary {
        clearError(controlErrorData): void;
        addError(controlErrorData): void;
    }

    export interface IValidationSummaryFactory {
        init(container: IContainer, initData: IValidationSummaryInitData): IValidationSummary;
    }
}
