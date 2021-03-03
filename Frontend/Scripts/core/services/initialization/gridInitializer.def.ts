namespace Services.Initialization {
    export interface IGridRow {
        data: any;
        cells: any[];
        details: any;
    }

    export interface IGridHeader {
        name: string;
    }

    export interface IGridColumn {
        sortable?: boolean;
        header: IGridHeader;
        cellInitializer: (rowData: any, row: IGridRow, index: number) => any;
    }

    export interface IGridInitializationData {
        settings: UI.IGridSettings;
        columns: IGridColumn[];
        items: any[];
        sortingData?: any;
        rowDetailsInitializer?: (rowData: any, row: IGridRow, index: number) => any;
    }

    export interface IGridInitializer {
        append(data: any): void;
        grid?: UI.IGrid;
    }

    export interface IGridInitializerFactory {
        init(container: IContainer, initData: IGridInitializationData): Promise<IGridInitializer>;
    }
}