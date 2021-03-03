namespace UI {
    export interface IInnerProcessInfo {
        title: string;
        progressInfo: IProgressInfo;
    }

    export interface IProgressInfo {
        processId: string;
        status: IProcessStatus;
        progress: number;
        resultMessage: string;
        statusMessage: string;
        innerProcess: IInnerProcessInfo;
        result: any;
    }

    export interface IBackgroundProcessViewInitData {
        getProgressUrl: string;
        processTitle: string;
        pingInterval: number;
        progressInfo: IProgressInfo;
        autoStart: boolean;
        cancelUrl: string;
        renderResult: ($wrapper: JQuery, result) => void;
        progressable: boolean;
    }

    export interface IBackgroundProcessView {
        start(): void;
        cancel(): void;
        getInfo(processId: string): any;
    }

    export interface IBackgroundProcessViewFactory {
        init(container: IContainer, initData: IBackgroundProcessViewInitData): Promise<IBackgroundProcessView>;
    }
}
