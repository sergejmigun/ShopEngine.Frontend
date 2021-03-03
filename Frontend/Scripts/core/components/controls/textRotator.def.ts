namespace UI {

    export interface ITextRotatorInitData {
        items: string[];
        currentItem?: number;
        rotateByClick?: boolean;
        rotateByMouseScroll?: boolean;
        inifiniteRotationInterval?: number;
        rotationType?: RotationType;
        $containerEl?: JQuery;
    }

    export interface ITextRotator {
        rotate: () => void;
        rotateBack: () => void;
        getCurrentItemIndex: () => number;
        setCurrentItem: (index: number) => void;
        onBeforeRotate: (handler: (i: number) => void) => void;
        onRotated: (handler: (i: number) => void) => void;
    }

    export interface ITextRotatorFactory {
        init(container: IContainer, initData: ITextRotatorInitData): Promise<ITextRotator>;
    }
}
