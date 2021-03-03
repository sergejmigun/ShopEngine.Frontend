namespace UI {
    export interface IRatingBoxInitData extends IInputControlInitData<number> {
        min: number;
        max: number;
        step?: number;
        size?: string;
    }

    export interface IRatingBox extends IInputControl<number> {
    }

    export interface IRatingBoxFactory extends IInputControlFactory<number, IRatingBox, IRatingBoxInitData> {
    }
}