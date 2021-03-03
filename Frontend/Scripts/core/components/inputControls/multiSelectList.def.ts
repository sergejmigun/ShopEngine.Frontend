namespace UI {
    export interface IMultiSelectListInitData extends IInputControlInitData<string[] | number[]> {
        items: ISelectListItem[];
        nullable?: boolean;
        fullWidth?: boolean;
        nonSelectedText?: string;
        itemsUrl?: string;
    }

    export interface IMultiSelectList extends IInputControl<string[] | number[]> {
        getSelectedItem(): ISelectListItem;
        setItems(items: ISelectListItem[]): void;
    }

    export interface IMultiSelectListFactory extends IInputControlFactory<string[] | number[], IMultiSelectList, IMultiSelectListInitData> {
    }
}