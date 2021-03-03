namespace Services.Initialization {
    export interface IComponentInitializationHelper {
        forInputControl<T, TControl extends UI.IInputControl<T>, TInitData extends UI.IInputControlInitData<T>>(factory: UI.IInputControlFactory<T, TControl, TInitData>, initData: TInitData, onInit?: (control: TControl) => void): UI.IInputControlInitializer<T, TControl>;
        forTemplate<TModel, T extends Components.ITemplate<TModel>>(factory: Components.ITemplateFactory<TModel, T>, model: TModel, onInit?: (template: T) => void): Components.ITemplateInitData<TModel, T>;
    }
}