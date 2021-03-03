namespace UI {
    export enum ButtonIconPosition {
        Right = 'right',
        Left = 'left'
    }

    export enum ButtonType {
        Submit = 'submit',
        Cancel = 'cancel',
        Add = 'add',
        Remove = 'remove',
        Edit = 'edit',
        View = 'view',
        Back = 'back',
        Other = 'other'
    }

    export enum ButtonSize {
        Large = 'lg',
        Medium = 'md',
        Small = 'sm',
        XSmall = 'xs'
    }

    export enum AccordionDirection {
        Horizontal = 'horizontal',
        Vertical = 'vertical',
    }

    export enum IProcessStatus {
        NotStarted = 0,
        InProgress = 1,
        Completed = 2,
        Aborted = 3,
        Canceled = 4,
        CompletedWithErrors = 5
    }

    export enum BarChartDirection {
        Horizontal,
        Vertical
    }

    export enum ChatViewOwnMessageAlignment {
        Right = "right",
        Left = "left"
    }

    export enum ConditionType {
        And = 'and',
        Or = 'or'
    }

    export enum DropDownMenuPostion {
        left = 'left',
        right = 'right'
    }

    export enum EmotionSize {
        Sm = 16,
        Md = 20,
        Lg = 24,
        Xl = 32,
    }

    export enum FilesViewMode {
        Tiles = 'tiles',
        List = 'list'
    }

    export enum INotificationType {
        Success = 'success',
        Error = 'error',
        Warning = 'warning',
    }

    export enum IChartLegendPosition {
        Left = 'left',
        Right = 'right'
    }

    export enum PopoverPlacement {
        Right = 'right',
        Left = 'left',
        Top = 'top',
        Bottom = 'bottom'
    }

    export enum ScrollViewDirection {
        LatestOnBottom = 'latestOnBottom',
        LatestOnTop = 'latestOnTop'
    }

    export enum TabsPosition {
        Top = 'top',
        Right = 'right',
        Left = 'left'
    }

    export enum RotationType {
        Flip = 'flip',
        Spin = 'spin'
    }

    export enum CodeEditorMode {
        Js = 'js',
        Css = 'css',
        Html = 'html',
        Xml = 'xml'
    }

    export enum RadioListPosition {
        Inline = 'inline',
        Vertical = 'vertical'
    }

    export enum InputType {
        String = 'string',
        SingleLineString = 'singleLineString',
        Integer = 'integer',
        Decimal = 'decimal',
        Boolean = 'boolean',
        Html = 'html',
        Date = 'date',
        DateTime = 'dateTime',
        Options = 'options',
        MultiOptions = 'multiOptions'
    }

}