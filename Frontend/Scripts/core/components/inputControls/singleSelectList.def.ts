namespace UI {
    export interface ISelectListItem {
        text: string;
        value: string | number;
        data?: any;
    }

    export interface ISingleSelectListInitData extends IInputControlInitData<string | number> {
        items: ISelectListItem[];
        nullable?: boolean;
        fullWidth?: boolean;
        nonSelectedText?: string;
        itemsUrl?: string;
    }

    export interface ISingleSelectList extends IInputControl<string | number> {
        getSelectedItem(): ISelectListItem;
        setItems(items: ISelectListItem[]): void;
        onChange(handler: () => void): void;
        onRemove(handler: () => void): void;
    }

    export interface ISingleSelectListFactory extends IInputControlFactory<string | number, ISingleSelectList, ISingleSelectListInitData> {
    }
}