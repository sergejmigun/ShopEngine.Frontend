namespace UI {
    export interface IFileData {
        fileName: string;
        data: any;
        size: number;
    }

    export interface IFileUploaderInitData extends IInputControlInitData<IFileData[]> {
        uploadUrl: string;
        autoUpload?: boolean;
        customButton?: JQuery;
        showFileName?: boolean;
        showProgressBar?: boolean;
        showUploadedFiles?: boolean;
        maxUploads?: number;
        maxFileSize?: number;
        filesViewMode?: FilesViewMode;
        availableExtensions?: string[];
        acceptFileTypes?: string[];
    }

    export interface IFileUploader extends IInputControl<IFileData[]> {
        removeFile(fileName: string): void;
        onStart(handler: (file) => void): void;
        onDone(handler: (file) => void): void;
        onFail(handler: (file) => void): void;
        onProgress(handler: (progress) => void): void;
    }

    export interface IFileUploaderFactory extends IInputControlFactory<IFileData[], IFileUploader, IFileUploaderInitData> {
    }
}