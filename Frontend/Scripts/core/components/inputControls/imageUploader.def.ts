namespace UI {
    export interface IImageUploaderInitData extends IFileUploaderInitData {
        showUploadedFiles?: boolean;
        showFileName?: boolean;
        customButton?: JQuery;
    }

    export interface IImageUploader extends IInputControl<IFileData[]> {
        onDone(handler: (img) => void): void;
    }

    export interface IImageUploaderFactory extends IInputControlFactory<IFileData[], IImageUploader, IImageUploaderInitData> {
    }
}