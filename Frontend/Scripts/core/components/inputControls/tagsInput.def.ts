namespace UI {
    export interface ITag {
        tagName: string,
        data: any
    }

    export interface ITagsInputInitData extends IInputControlInitData<ITag[]> {
        controlInitializer: UI.IInputControlInitializer<any, any>;
        validate?: (value: ITag) => Promise<boolean>;
        valueFormatter?: (control: IInputControl<any>) => any;
        inputWrapperCss?: string;
    }

    export interface ITagsInput extends IInputControl<ITag[]> {
        append(tag: ITag): void;
    }

    export interface ITagsInputFactory extends IInputControlFactory<ITag[], ITagsInput, ITagsInputInitData> {
    }
}