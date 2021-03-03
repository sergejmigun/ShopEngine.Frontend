namespace Services.Helpers {
    export interface IPageTemplateData {
        formTemplateData: Components.ITemplateInitData<any, any>;
        viewTemplateData: Components.ITemplateInitData<any, any>;
        formTemplateCustomButtons?: UI.IButtonInitData[];
        viewTemplateCustomButtons?: UI.IButtonInitData[];
    }
    
    export interface ITabPageData {
        tabName: string;
        tabTitle: string;
        tabIconCss: string;
        viewData: IPageTemplateData;
        submitable: boolean;
        requireId: boolean;
        onSubmit?(identity: any): void;
    }

    export interface ISingleViewData {
        idPropName: string;
        cancelCreationAction: () => void;
        viewData: IPageTemplateData;
        customButtons?: UI.IButtonInitData[];
    }

    export interface ITabsData {
        idPropName: string;
        cancelCreationAction: () => void;
        tabs: ITabPageData[];
    }

    export interface IPageFormHelper {
        initSingleView(data: ISingleViewData, container: IContainer): Promise<any>;
        initTabs(tabsData: ITabsData, container: IContainer): Promise<UI.ITabs>;
    }
}