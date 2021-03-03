namespace UI {
    export interface IFileBrowserInitData {
        url: string;
    }

    export interface IFileBrowser {
        load(handler: () => void): void;
    }

    export interface IFileBrowserFactory {
        init(container: IContainer, initData: IFileBrowserInitData): Promise<IFileBrowser>;
    }
}