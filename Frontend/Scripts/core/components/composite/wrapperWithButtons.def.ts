namespace Components.Common {
    export interface IWrapperWithButtonsModel<TModel, TTemplate extends ITemplate<TModel>> extends ITemplateWrapperModel<TModel, TTemplate>{
        buttons: UI.IButtonInitData[];
        noLine?: boolean;
    }

    export interface IWrapperWithButtons<TModel extends IWrapperWithButtonsModel<TInnerModel, TTemplate>, TInnerModel, TTemplate extends ITemplate<TInnerModel>> extends ITemplateWrapper<TModel, TInnerModel, TTemplate> {
        setReadOnly: (readOnly?: boolean) => void;
        setDisabled: (disabled?: boolean) => void;
    }

    export interface IWrapperWithButtonsFactory extends ITemplateFactory<IWrapperWithButtonsModel<any, any>, IWrapperWithButtons<any, any, any>> {
        init2<TModel extends ITemplateWrapperModel<TInnerModel, TTemplate>, TInnerModel, TTemplate extends ITemplate<TInnerModel>>(model: TModel, container: IContainer): Promise<TTemplate>;
    }
}

