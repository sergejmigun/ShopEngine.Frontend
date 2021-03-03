namespace UI {
    export interface IDateTimePickerInitData extends IInputControlInitData<Date> {
        max?: number;
        min?: number;
        includeTime?: boolean;
        format?: string;
    }

    export interface IDateTimePicker extends IInputControl<Date> {
    }

    export interface IDateTimePickerFactory extends IInputControlFactory<Date, IDateTimePicker, IDateTimePickerInitData> {
    }
}