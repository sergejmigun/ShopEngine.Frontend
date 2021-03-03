namespace Services {
    export interface IModalHelperResult<TModel, T extends Components.ITemplate<TModel>> {
        template: T;
        modal: UI.IModal;
    }

    export interface IModalHelperInitData {
        title: string;
        externalUrl?: string;
        initButtons?($buttonsWrapper, result): void;
        template: Components.ITemplateInitData<any, any>;
        large?: boolean;
    }

    export interface IModalHelper {
        open<TModel, T extends Components.ITemplate<TModel>>(initData: IModalHelperInitData): Promise<IModalHelperResult<TModel, T>>;
    }
}