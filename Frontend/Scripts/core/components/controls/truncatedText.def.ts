namespace UI {
    export interface ITruncatedTextInitData {
        text: string;
        width?: number;
    }

    export interface ITruncatedText {
    }

    export interface ITruncatedTextFactory {
        init(container: IContainer, initData: ITruncatedTextInitData): Promise<ITruncatedText>;
    }
}
