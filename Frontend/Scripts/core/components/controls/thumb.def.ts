namespace UI {
    export interface IThumbInitData {
        src: string;
        thumbFileName?: string;
    }

    export interface IThumb {
        remove(): void;
        click(handler: () => void): void;
    }

    export interface IThumbFactory {
        init(container: IContainer, initData: IThumbInitData): Promise<IThumb>;
    }
}
