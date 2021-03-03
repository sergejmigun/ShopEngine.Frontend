namespace UI {
    export interface ITagCloudItem {
        text: string;
        link: string;
        rate: number;
    }

    export interface ITagCloudInitData {
        height: number;
        tags: ITagCloudItem[];
    }

    export interface ITagCloud {
        remove(): void;
        tagClick(handler: () => void): void;
    }

    export interface ITagCloudFactory {
        init(container: IContainer, initData: ITagCloudInitData): Promise<ITagCloud>;
    }
}
