namespace UI {
    export interface Time {
        hours: number;
        minutes: number;
        seconds: number;
    }

    export interface ITimePickerInitData extends IInputControlInitData<Time> {
        nullable?: boolean;
        format?: string;
        max?: Time;
        min?: Time;
    }

    export interface ITimePicker extends IInputControl<Time> {
    }

    export interface ITimePickerFactory extends IInputControlFactory<Time, ITimePicker, ITimePickerInitData> {
    }
}