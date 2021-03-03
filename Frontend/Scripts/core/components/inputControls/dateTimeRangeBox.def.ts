namespace UI {
    export interface DateTimeRange {
        from?: Date;
        to?: Date;
    }

    export interface IDateTimeRangeBoxInitData extends IInputControlInitData<DateTimeRange> {
        nullable?: boolean;
        format?: string;
        timePicker?: boolean;
        max?: Date;
        min?: Date;
    }

    export interface IDateTimeRangeBox extends IInputControl<DateTimeRange> {
    }

    export interface IDateTimeRangeBoxFactory extends IInputControlFactory<DateTimeRange, IDateTimeRangeBox, IDateTimeRangeBoxInitData> {
    }
}