namespace UI {
    export interface IImageGalleryItem {
        src: string;
    }

    export interface IImageGalleryInitData {
        index: number;
    }

    export interface IImageGallery {
        pageChanged(handler: () => void): void;
    }

    export interface IImageGalleryFactory {
        open(items: IImageGalleryItem[], initData: IImageGalleryInitData): Promise<IImageGallery>;
    }
}