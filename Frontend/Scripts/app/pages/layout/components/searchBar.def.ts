namespace UI {
    export interface ISearchBarInitData {
    }

    export interface ISearchBar {
    }

    export interface ISearchBarFactory {
        init(container: IContainer, initData: ISearchBarInitData): Promise<ISearchBar>;
    }
}