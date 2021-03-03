namespace UI {
    export interface IItemsSwitcherItem {
        text: string;
        value: string;
        data: any;
    }

    export interface IItemsSwitcherInitData extends IInputControlInitData<string> {
        items: IItemsSwitcherItem[];
        textWidth?: number;
    }

    export interface IItemsSwitcher extends IInputControl<string> {
        next: () => void;
        prev: () => void;
        getCurrentItem: () => IItemsSwitcherItem;
    }

    export interface IItemsSwitcherFactory extends IInputControlFactory<string, IItemsSwitcher, IItemsSwitcherInitData> {
    }
}