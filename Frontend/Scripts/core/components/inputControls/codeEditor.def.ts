namespace UI {

    export interface ICodeEditorInitData extends IInputControlInitData<string> {
        mode: CodeEditorMode;
    }

    export interface ICodeEditor extends IInputControl<string> {
    }

    export interface ICodeEditorFactory extends IInputControlFactory<string, ICodeEditor, ICodeEditorInitData> {
    }
}