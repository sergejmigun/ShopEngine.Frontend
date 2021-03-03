namespace UI {
    export interface IInputsListGroupData {
        groupKey: string;
    }

    export interface IInputsListInitData<T> extends IInputControlInitData<T[]> {
        header?: UI.IUiItemData;
        addButtonText?: string;
        sortable?: boolean;
        selectable?: boolean;
        canAdd?: boolean;
        canDelete?: boolean;
        hasGroups?: boolean;
        defaultGroupData?: IInputsListGroupData;
        controlInitializer?: UI.IInputControlInitializer<T, IInputControl<T>>;
        actionsData?: IDropDownMenuButtonData[];
        newItemsActionsData?: IDropDownMenuButtonData[];
        noItemsText?: string;
        complexValue?: boolean;
    }

    export interface IInputsList<T> extends IInputControl<T[]> {
        getControl(index: number, groupKey: string): IInputControl<T>;
        getAllControls(): IInputControl<T>[];
        getSelectedIndexes(): number[];
        orderChanged(handler: () => void): void;
        controlRemoved(handler: () => void): void;
        onSelectionChange(handler: () => void): void;
    }

    export interface IInputsListFactory<T> extends IInputControlFactory<T[], IInputsList<T>, IInputsListInitData<T>> {
    }
}