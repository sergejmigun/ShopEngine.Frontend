namespace UI {
    export interface IProgressBarInitData extends IProgressBarData {
        enableProgressAnimation: boolean;
    }

    export interface IProgressBarData {
        status: string;
        progress: number;
    }

    export interface IProgressBar {
        update(data: IProgressBarData): void;
        updateProgress(progress: number): void;
        updateStatus(status: string): void;
        remove(): void;
    }

    export interface IProgressBarFactory {
        init(container: IContainer, initData: IProgressBarInitData): Promise<IProgressBar>;
    }
}