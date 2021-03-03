import Components_global = Components;

namespace Components {
    export interface IIdentityResponseData {
        id: string | number;
        data: any;
    }

    export interface IFormTemplate<TInModel, TOutModel> extends ITemplate<TInModel> {
        submit: () => Promise<{ status: IFormSubmissionStatus, data: IIdentityResponseData }>;
        reset: () => void;
        serialize: () => TOutModel;
        validate: () => Promise<UI.IValidationError[]>;
        hasUnsubmittedChanges(): boolean;
    }

    export interface ITemplateWrapperModel<TModel, TTemplate extends ITemplate<TModel>> {
        templateData: Components.ITemplateInitData<TModel, TTemplate>;
    }

    export interface ITemplateWrapper<TModel extends ITemplateWrapperModel<TInnerModel, TTemplate>, TInnerModel, TTemplate extends ITemplate<TInnerModel>> extends ITemplate<TModel> {
        getInnerTemplate: () => TTemplate;
    }

    export interface ITemplateInitData<TModel, TTemplate extends ITemplate<TModel>> {
        factory: ITemplateFactory<TModel, TTemplate>;
        model: TModel;
        onInit?: (template: TTemplate) => void;
    }

    export interface ITemplate<TModel> {
        name?: string;
        reinit?(model?: TModel): Promise<ITemplate<TModel>>;
        remove?(): void;
        onRemove?: (callback: () => void) => void;
    }

    export interface ITemplateFactory<TModel, TTemplate extends ITemplate<TModel>> {
        init(model: TModel, container: IContainer): Promise<TTemplate>;
    }
}

interface ITemplates {
    initContentProvider($templateElement): IContentProvider;
    init<TModel, TTemplate extends Components.ITemplate<TModel>>(initData: Components.ITemplateInitData<TModel, TTemplate>, container: IContainer): Promise<TTemplate>;
}
