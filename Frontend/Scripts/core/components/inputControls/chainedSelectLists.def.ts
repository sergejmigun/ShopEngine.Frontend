namespace UI {
    export interface IChainedListRelationsData {
        relatedListData?: IChainedListRelationsData;
        getItems?: (parentValue: string | number) => ISelectListItem[];
        itemsUrl?: string;
        nonSelectedText?: string;
    }

    export interface IChainedSelectListInitData extends IInputControlInitData<(string | number)[]> {
        relatedListData: IChainedListRelationsData;
        items?: ISelectListItem[];
        itemsUrl?: string;
        nonSelectedText?: string;
    }

    export interface IChainedSelectList extends IInputControl<(string | number)[]> {
    }

    export interface IChainedSelectListFactory extends IInputControlFactory<(string | number)[], IChainedSelectList, IChainedSelectListInitData> {
    }
}