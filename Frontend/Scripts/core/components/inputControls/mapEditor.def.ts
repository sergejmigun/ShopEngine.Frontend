namespace UI {
    export interface IMapMarker {
        lattitude: number;
        longtitude: number;
        title: string;
        caption: string;
    }

    export interface IMapData {
        zoom: number;
        center: number;
        lattitude: number;
        longtitude: number;
        markers: IMapMarker[];
    }

    export interface IMapEditorInitData extends IInputControlInitData<IMapData> {
        markers: IMapMarker[];
        zoom: number;
        lattitude: number;
        longtitude: number;
    }

    export interface IMapEditor extends IInputControl<IMapData> {
        init(handler: () => void): void;
    }

    export interface IMapEditorFactory extends IInputControlFactory<IMapData, IMapEditor, IMapEditorInitData> {
    }
}