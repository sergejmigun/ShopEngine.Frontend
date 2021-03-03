namespace UI {
    export interface IInputsSetInitData extends IInputControlInitData<object> {
        template: string;
        controlInitializators: { [name: string]: UI.IInputControlInitializer<any, any> }
    }

    export interface IInputsSet extends IInputControl<object> {
        getControl(name: string): IInputControl<any>;
        getAllControls(): IInputControl<any>[];
    }

    export interface IInputsSetFactory extends IInputControlFactory<object, IInputsSet, IInputsSetInitData> {
    }
}