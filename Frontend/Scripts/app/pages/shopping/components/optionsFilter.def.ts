namespace UI {
    export interface ICheckedFilterOption {
        categoryId: number;
        optionId: number;
    }

    export interface IFilterOption {
        id: number;
        name: string;
        count: number;
        checked?: boolean;
    }

    export interface ICategoryFilterOptions {
        categoryId: number;
        categoryName: string;
        options: IFilterOption[];
    }

    export interface IOptionsFilterInitData {
        categoryOptions: ICategoryFilterOptions[];
    }

    export interface IOptionsFilter {
        onChange(handler: (options: ICheckedFilterOption[]) => void): void;
    }

    export interface IOptionsFilterFactory {
        init(container: IContainer, initData: IOptionsFilterInitData): Promise<IOptionsFilter>;
    }
}