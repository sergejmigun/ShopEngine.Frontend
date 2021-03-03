namespace UI {
    export interface IFixedAreaInitData {
        bottom?: boolean;
        marginTop?: number;
    }

    export interface IFixedArea {
        fixArea(): void;
        unfixArea(): void;
    }

    export interface IFixedAreaFactory {
        init($element: JQuery, initData: IFixedAreaInitData): Promise<IFixedArea>;
    }
}
