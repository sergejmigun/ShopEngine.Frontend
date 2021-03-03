namespace UI {

    export interface IRadioListInitData extends IInputControlInitData<string | number> {
        items: ISelectListItem[];
        position: RadioListPosition;
    }

    export interface IRadioList extends IInputControl<string | number> {
    }

    export interface IRadioListFactory extends IInputControlFactory<string | number, IRadioList, IRadioListInitData> {
    }
}