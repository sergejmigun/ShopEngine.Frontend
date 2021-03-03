import UI_global = UI;

namespace UI {
    export interface IUiItemData {
        data?: any;
        css?: string;
        text?: string;
        html?: string | JQuery;
        template?: Components.ITemplateInitData<any, any>;
        render?: (container: IContainer, data: any) => void;
    }

    export interface IInputControlInitializer<T, TControl extends IInputControl<T>> {
        init(container: IContainer, overridenInitData?: object): Promise<TControl>;
    }

    export interface IValidationError {
        name: string;
        message: string;
        warning?: boolean;
        data: any;
    }

    export interface IInputControlInitData<T> {
        name?: string;
        value?: T;
        readOnly?: boolean;
        disabled?: boolean;
    }

    export interface IInputControl<T> {
        value(value?: T): T;
        readOnly(isReadOnly?: boolean): boolean;
        disabled(isDisabled?: boolean): boolean;
        displayError(error: IValidationError): void;
        clearError(errorName: string): void;
        getAllErrors(): string[];
        clearAllErrors(): void;
        remove(): void;
        getJQueryObject(): JQuery;
        onChange(handler: () => void): void;
        onRemove(handler: () => void): void;
        type?: string;
        name?: string;
    }

    export interface IInputControlFactory<T, TInputControl extends IInputControl<T>, TInitData extends IInputControlInitData<T>> {
        init(container: IContainer, initData: TInitData): Promise<TInputControl>;
        __?: T;
    }
}

interface IUi {
    renderItem($wrapper: JQuery, containerReady: Promise<any>, itemModel: UI.IUiItemData, defaultContent?: JQuery | string, autoTruncatedContent?: boolean): Promise<any>;
}