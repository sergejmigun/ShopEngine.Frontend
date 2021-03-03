namespace UI {
    export interface IImageEditorInitData {
        disableCropping: boolean;
        dragMode: string;
        aspectRatio: any[];
        disableZooming: boolean;
        disableRotation: boolean;
        imageUrl: string;
    }

    export interface IImageEditor {
        getState(): any;
        destroy(): void;
        onChange(handler: () => void): void;
        onRemove(handler: () => void): void;
        dblclick(handler: () => void): void;
        submit(handler: () => void): void;
    }

    export interface IImageEditorFactory {
        init(container: IContainer, initData: IImageEditorInitData): Promise<IImageEditor>;
    }
}