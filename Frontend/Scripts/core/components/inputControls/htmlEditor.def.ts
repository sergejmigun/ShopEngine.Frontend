namespace UI {
    export interface IHtmlEditorInitData extends IInputControlInitData<string> {
    }

    export interface IHtmlEditor extends IInputControl<string> {
    }

    export interface IHtmlEditorFactory extends IInputControlFactory<string, IHtmlEditor, IHtmlEditorInitData> {
    }
}