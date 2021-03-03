namespace UI {
    export interface ICarouselItem {
        content: string | JQuery;
        contentReady: Promise<any>;
    }

    export interface ICarouselInitData {
        items: ICarouselItem[];
        slides: number;
        minItemWidth?: number;
        minItemHeight?: number;
        infinite?: boolean;
        variableWidth?: boolean;
        dots?: boolean;
        arrows?: boolean;
    }

    export interface ICarousel {
        addItem(item: ICarouselItem): void;
        removeItem(index: number): void;
        setItems(items: ICarouselItem[]): void;
        clearItems(): void;
        destroy(): void;
        movingStart(handler: () => void): void;
        movingEnd(handler: () => void): void;
    }

    export interface ICarouselFactory {
        init(container: IContainer, initData: ICarouselInitData): Promise<ICarousel>;
    }
}