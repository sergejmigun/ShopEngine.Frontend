namespace UI {
    export interface IGridEntityFinderColumn {
        name: string;
        text: string;
        css?: string;
    }

    export interface IGridEntityFinderInitData extends IInputControlInitData<(string | number)[]> {
        findUrl: string;
        textPropName: string;
        valuePropName: string;
        finderPlaceholder?: string;
        minLength?: number;
        loadByIds(ids: (string | number)[]): Promise<any[]>;
        gridColumns: IGridEntityFinderColumn[];
        noDataText?: string;
        customCells?: { columName: string, cellData: UI.IUiItemData }[];
    }

    export interface IGridEntityFinder extends IInputControl<(string | number)[]> {
        getData: () => any[];
    }

    export interface IGridEntityFinderFactory extends IInputControlFactory<(string | number)[], IGridEntityFinder, IGridEntityFinderInitData> {
    }
}