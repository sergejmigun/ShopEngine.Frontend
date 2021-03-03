namespace UI {

    export interface IFileData {
        fileName: string;
        size: number;
        data: any;
    }

    export interface IFilesViewerInitData {
        files: IFileData[];
        mode?: FilesViewMode;
        downloadAction?: (file: any) => void;
        viewAction?: (file: any) => void;
        editAction?: (file: any) => void;
        deleteAction?: (file: any) => void;
        downloadUrl?: string;
        defaultAction?: string;
    }

    export interface IFilesViewer {
        changeView(mode: FilesViewMode): void;
        setFiles(files: IFileData[]): void;
        addFile(file: IFileData): void;
        removeFile(file: IFileData): void;
        clear(): void;
        disableAction(actionName: string): void;
        enableAction(actionName: string): void;
    }

    export interface IFilesViewerFactory {
        init(container: IContainer, initData: IFilesViewerInitData): Promise<IFilesViewer>;
    }
}