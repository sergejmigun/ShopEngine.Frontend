namespace Services {
    export interface IPageHashData {
        mode: PageMode;
        id?: any;
        tabIndex?: number;
    }

    export interface IPageUrlHelper {
        getHashString(data: IPageHashData): string;
        setHashData(data: IPageHashData): void;
        parseHashData(): IPageHashData;
        hasSetMode(): boolean;
    }
}