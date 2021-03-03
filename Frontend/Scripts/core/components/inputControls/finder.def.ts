namespace UI {
    export interface IFinderInitData extends IInputControlInitData<string | number> {
        url: string;
        textPropName: string;
        valuePropName: string;
        placeholder?: string;
        loadById?(value: string | number): any;
        minLength?: number;
        excludedItems?: (string | number)[],
        cache?: boolean;
        noValueText?: string;
    }

    export interface IFinder extends IInputControl<string | number> {
        getValueData(): any;
    }

    export interface IFinderFactory extends IInputControlFactory<string | number, IFinder, IFinderInitData> {
    }
}