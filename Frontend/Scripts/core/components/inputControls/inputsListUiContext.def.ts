namespace Services.InputsList {
    export interface IInputsListControlsData {
        container: JQuery;
    }

    export interface IInputsListGroupData {
        title: string;
        container: JQuery;
        appendItem(itemContainer: JQuery): void;
        controlsData: IInputsListControlsData[];
        groupingButton: JQuery;
        expanded: boolean;
    }

    export interface IInputsListContextInitData {
        hasGroups: boolean;
        sortable: boolean;
        selectable: boolean;
        noItemsText: string;
        containerReady: Promise<any>;
    }

    export interface IInputsListContext {
        container: JQuery;
        initHeader(header: UI.IUiItemData): void;
        showNoDataMessage(): void;
        initAddButton(addButtonText: string, action: () => any): UI.IButton;
        initSortable(onSort: (oldIndex: number, newIndex: number) => void): void;
        setReadOnly(): void;
        prependGroupRow(prevGroupData: IInputsListGroupData, nextGroupData: IInputsListGroupData, isFirst: boolean): void;
        renderGroupRow(groupData: IInputsListGroupData, isFirstRow: boolean): void;
        renderControlRow(controlInitializer: UI.IInputControlInitializer<any, any>, value: any, actionsData): void;
        appendControlRow(controlData): void;
        appendControlRowToGroup(controlData): void;
    }

    export interface IInputsListContextFactory {
        init(initData: IInputsListContextInitData): Promise<IInputsListContext>;
    }
}