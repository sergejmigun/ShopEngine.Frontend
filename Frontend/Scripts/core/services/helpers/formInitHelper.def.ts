namespace Services.Helpers {
    export interface IFormActionData {
        status: string;
        data?: any;
    }

    export interface IFormHelperWrapperInitData<TModel, T extends Components.ITemplate<TModel>> extends IFormHelperInitData<TModel, T> {
        noLine?: boolean;
        onInit?: (template: T) => void;
    }

    export interface IFormHelperModalInitData<TModel, T extends Components.ITemplate<TModel>> extends IFormHelperInitData<TModel, T> {
        title: string;
        externalUrl?: string;
        large?: boolean;
    }


    export interface IFormHelperInitData<TModel, T extends Components.ITemplate<TModel>> {
        innerTemplateData: Components.ITemplateInitData<TModel, T>;
        hasSubmitButton?: boolean;
        hasCancelButton?: boolean;
        customButtons?: UI.IButtonInitData[];
        readOnly?: boolean;
    }

    export interface IFormModalHelperResult<TModel, T extends Components.ITemplate<TModel>> extends IModalHelperResult<TModel, T>, IFormHelperResult {
    }

    export interface IFormTemplateWrapperHelperResult<TModel, T extends Components.IFormTemplate<TModel, any>, TWrapperModel extends Components.Common.IWrapperWithButtonsModel<TModel, T>> extends IFormHelperResult {
        templateData: Components.ITemplateInitData<TWrapperModel, Components.Common.IWrapperWithButtons<TWrapperModel, TModel, T>>;
    }

    export interface IFormHelperResult {
        onSubmit(handler: (data) => void): void;
        onCancel(handler: () => void): void;
    }

    export interface IFormInitHelper {
        openModal<TModel, T extends Components.ITemplate<TModel>>(intitData: IFormHelperModalInitData<TModel, T>): Promise<IFormModalHelperResult<TModel, T>>;
        getWrapperTemplateData<TModel, T extends Components.IFormTemplate<TModel, any>, TWrapperModel extends Components.Common.IWrapperWithButtonsModel<TModel, T>>(initData: IFormHelperWrapperInitData<TModel, T>)
            : IFormTemplateWrapperHelperResult<TModel, T, TWrapperModel>;
        initWrapperTemplate<TModel, T extends Components.IFormTemplate<TModel, any>>(initData: IFormHelperWrapperInitData<TModel, T>, container: IContainer)
            : Promise<{
                onSubmit(handler: (data) => void): void;
                onCancel(handler: () => void): void;
                wrapper: Components.Common.IWrapperWithButtons<Components.Common.IWrapperWithButtonsModel<TModel, T>, TModel, T>
            }>
    }
}