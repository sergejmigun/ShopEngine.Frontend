namespace UI {
    export interface IPaginationInitData {
        pageSize: number;
        page: number;
        total: number;
        duplicateContainers?: IContainer[];
        urlTemplate?: string;
    }

    export interface IPagination {
        changePageSize(pageSize: number): void;
        changeTotal(total: number): void;
        pageChanged(handler: (page: number) => void): void;
    }

    export interface IPaginationFactory {
        init(container: IContainer, initData: IPaginationInitData): Promise<IPagination>;
    }
}