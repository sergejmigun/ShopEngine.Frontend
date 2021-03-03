namespace UI {
    export interface ILoader {
        show(): void;
        hide(): void;
    }

    export interface ILoaderFactory {
        setLoader($container: JQuery): void;
        initOverlay($container: JQuery): Promise<ILoader>;
    }
}
