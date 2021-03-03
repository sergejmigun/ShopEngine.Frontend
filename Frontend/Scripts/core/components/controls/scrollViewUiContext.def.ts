namespace Services.ScrollView {
    export interface IScrollViewUiContextInitData {
        direction: UI.ScrollViewDirection;
        containerReady: Promise<any>;
    }

    export interface IScrollViewUiContext {
        addOlderData(content: JQuery): void;
        addNewerData(content: JQuery): void;
        initLoadOlderDataButton(action: () => void): void;
        initLoadNewerDataButton(action: () => void): void;
        toggleButtonVisibility($button: JQuery, isVisible: boolean): void;
        initInfiniteScroll(onScroll: (topOffset: number, bottomOffset: number) => void): void;
        clearActions(): void;
        olderDataLoader: UI.ILoader;
        newerDataLoader: UI.ILoader;
        onContentChanged(handler: () => void): void;
    }

    export interface IScrollViewUiContextFactory {
        init(container: JQuery, initData: IScrollViewUiContextInitData): Promise<IScrollViewUiContext>;
    }
}