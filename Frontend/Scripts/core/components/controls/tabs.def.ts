namespace UI {

    export interface ITab {
        header: IUiItemData;
        content: IUiItemData;
        index?: number;
        headerText?: string;
        data?: any;
    }

    export interface ITabsInitData {
        tabs: ITab[];
        activeTabIndex?: number;
        tabsPosition?: TabsPosition;
        tabWidth?: number;
        loadAllContent?: boolean;
    }

    export interface ITabs {
        showTab(index: number): void;
        addTab(tab: ITab, index?: number): void;
        removeTab(index: number): void;
        getActiveTabIndex(): number;
        onTabChanged(handler: (tab: ITab) => void): void;
        onTabInit(handler: (tab: ITab) => void): void;
    }

    export interface ITabsFactory {
        init(container: IContainer, initData: ITabsInitData): Promise<ITabs>;
    }
}
