namespace Services.Initialization {
    export interface ITabsInitData {
        container: IContainer;
        tabs: UI.ITab[];
        activeTabIndex?: number;
    }

    export interface ITabsInitializer {
        initTabs(initData: ITabsInitData): Promise<UI.ITabs>;
    }
}