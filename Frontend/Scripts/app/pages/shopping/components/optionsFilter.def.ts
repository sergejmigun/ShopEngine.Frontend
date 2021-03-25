namespace UI {
    export interface IOptionsFilterInitData {
    }

    export interface IOptionsFilter {
    }

    export interface IOptionsFilterFactory {
        init(container: IContainer, initData: IOptionsFilterInitData): Promise<IOptionsFilter>;
    }
}