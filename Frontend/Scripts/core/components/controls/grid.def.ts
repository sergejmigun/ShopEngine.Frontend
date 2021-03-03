namespace UI {
    export interface IGridCell {
        showContent: () => void;
        hideContent: () => void;
        getContent: any;
        data: any;
    }

    export interface IGridRow {
        show: () => void;
        hide: () => void;
        cells: IGridCell[];
        data: any;
    }

    export interface IGridColumn {
        name: string;
        show: () => void;
        hide: () => void;
        cells: IGridCell[];
    }

    export interface IGridFixedHeadersInitData {
        offset: number;
    }

    export interface IGridSettings {
        detailRows?: boolean;
        grouping?: boolean;
        selectable?: boolean;
        fixedHeaders?: IGridFixedHeadersInitData;
        autoTruncatedContent?: boolean;
        noData?: UI.IUiItemData;
        rowsOrdering?: boolean;
        sortable?: boolean;
    }

    export interface IGridRowDetailsInitData extends UI.IUiItemData {
        expanded: boolean;
        element?: JQuery;
    }

    export interface IGridColumnInitData extends UI.IUiItemData {
        name: string;
    }

    export interface IGridRowInitData {
        data: any;
        cells: UI.IUiItemData[];
        innerRows?: IGridRowInitData[];
        selected?: boolean;
        details?: IGridRowDetailsInitData;
        groupCollapsed?: boolean;
    }

    export interface IGridInitData {
        columns: IGridColumnInitData[]
        rows: IGridRowInitData[];
        settings: IGridSettings;
        sortingData?: object;
    }

    export interface IGrid {
        remove(): void;
        getSelectedRows(): IGridRow[];
        getRows(): IGridRow[];
        getColumns(): IGridColumn[];
        appendRow(row: IGridRowInitData): Promise<any>;
        removeRows(predicate: (rowData) => boolean): void;
        onOrderChanged(handler: (data: { column: string, direction: string }[]) => void): void;
        onSelectionChanged(handler: () => void): void;
        onRowsOrderChanged(handler: () => void): void;
        onRenderCompleted(handler: () => void): void;
        onToggleDetails(handler: (data: { data: any, expanded: boolean }) => void): void;
    }

    export interface IGridFactory {
        init(container: IContainer, initData: IGridInitData): Promise<IGrid>;
    }
}