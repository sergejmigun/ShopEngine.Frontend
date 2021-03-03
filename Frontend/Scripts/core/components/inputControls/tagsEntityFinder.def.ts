namespace UI {
    export interface ITagsEntityFinderInitData extends IInputControlInitData<(string | number)[]> {
        finderUrl: string;
        textPropName: string;
        valuePropName: string;
        loadByIds(ids: (string | number)[]): Promise<any[]>;
        finderPlaceholder?: string;
    }

    export interface ITagsEntityFinder extends IInputControl<(string | number)[]> {
    }

    export interface ITagsEntityFinderFactory extends IInputControlFactory<(string | number)[], ITagsEntityFinder, ITagsEntityFinderInitData> {
    }
}