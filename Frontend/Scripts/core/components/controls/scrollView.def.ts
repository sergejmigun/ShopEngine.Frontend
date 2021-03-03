namespace UI {

    export interface IScrollViewPageData {
        hasMoreData: boolean;
        content: JQuery;
    }

    export interface IScrollViewInitData {
        loadPage(token: string, loadPrevios: boolean): Promise<IScrollViewPageData>;
        maxPages?: number;
        loadMoreButton?: boolean;
        direction: ScrollViewDirection;
        currentPage: number;
        containerReady: Promise<any>;
    }

    export interface IScrollView {
        refresh(): Promise<any>;
        onContentChanged(handler: () => void): void;
        onPageCleared(handler: (page) => void): void;
    }

    export interface IScrollViewFactory {
        init(contentProvider: IContentProvider, initData: IScrollViewInitData): Promise<IScrollView>;
    }
}
