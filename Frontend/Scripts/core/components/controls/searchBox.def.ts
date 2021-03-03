namespace UI {
    export interface ISearchBoxInitData {
        value?: string
        placeholder?: string;
    }

    export interface ISearchBox {
        getValue(): string;
        onChange(handler: () => void): void;
        onRemove(handler: () => void): void;
        submit(handler: (value: string) => void): void;
    }

    export interface ISearchBoxFactory {
        init(container: IContainer, initData: ISearchBoxInitData): Promise<ISearchBox>;
    }
}
