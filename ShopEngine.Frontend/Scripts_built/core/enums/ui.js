var UI;
(function (UI) {
    let ButtonIconPosition;
    (function (ButtonIconPosition) {
        ButtonIconPosition["Right"] = "right";
        ButtonIconPosition["Left"] = "left";
    })(ButtonIconPosition = UI.ButtonIconPosition || (UI.ButtonIconPosition = {}));
    let ButtonType;
    (function (ButtonType) {
        ButtonType["Submit"] = "submit";
        ButtonType["Cancel"] = "cancel";
        ButtonType["Add"] = "add";
        ButtonType["Remove"] = "remove";
        ButtonType["Edit"] = "edit";
        ButtonType["View"] = "view";
        ButtonType["Back"] = "back";
        ButtonType["Other"] = "other";
    })(ButtonType = UI.ButtonType || (UI.ButtonType = {}));
    let ButtonSize;
    (function (ButtonSize) {
        ButtonSize["Large"] = "lg";
        ButtonSize["Medium"] = "md";
        ButtonSize["Small"] = "sm";
        ButtonSize["XSmall"] = "xs";
    })(ButtonSize = UI.ButtonSize || (UI.ButtonSize = {}));
    let AccordionDirection;
    (function (AccordionDirection) {
        AccordionDirection["Horizontal"] = "horizontal";
        AccordionDirection["Vertical"] = "vertical";
    })(AccordionDirection = UI.AccordionDirection || (UI.AccordionDirection = {}));
    let IProcessStatus;
    (function (IProcessStatus) {
        IProcessStatus[IProcessStatus["NotStarted"] = 0] = "NotStarted";
        IProcessStatus[IProcessStatus["InProgress"] = 1] = "InProgress";
        IProcessStatus[IProcessStatus["Completed"] = 2] = "Completed";
        IProcessStatus[IProcessStatus["Aborted"] = 3] = "Aborted";
        IProcessStatus[IProcessStatus["Canceled"] = 4] = "Canceled";
        IProcessStatus[IProcessStatus["CompletedWithErrors"] = 5] = "CompletedWithErrors";
    })(IProcessStatus = UI.IProcessStatus || (UI.IProcessStatus = {}));
    let BarChartDirection;
    (function (BarChartDirection) {
        BarChartDirection[BarChartDirection["Horizontal"] = 0] = "Horizontal";
        BarChartDirection[BarChartDirection["Vertical"] = 1] = "Vertical";
    })(BarChartDirection = UI.BarChartDirection || (UI.BarChartDirection = {}));
    let ChatViewOwnMessageAlignment;
    (function (ChatViewOwnMessageAlignment) {
        ChatViewOwnMessageAlignment["Right"] = "right";
        ChatViewOwnMessageAlignment["Left"] = "left";
    })(ChatViewOwnMessageAlignment = UI.ChatViewOwnMessageAlignment || (UI.ChatViewOwnMessageAlignment = {}));
    let ConditionType;
    (function (ConditionType) {
        ConditionType["And"] = "and";
        ConditionType["Or"] = "or";
    })(ConditionType = UI.ConditionType || (UI.ConditionType = {}));
    let DropDownMenuPostion;
    (function (DropDownMenuPostion) {
        DropDownMenuPostion["left"] = "left";
        DropDownMenuPostion["right"] = "right";
    })(DropDownMenuPostion = UI.DropDownMenuPostion || (UI.DropDownMenuPostion = {}));
    let EmotionSize;
    (function (EmotionSize) {
        EmotionSize[EmotionSize["Sm"] = 16] = "Sm";
        EmotionSize[EmotionSize["Md"] = 20] = "Md";
        EmotionSize[EmotionSize["Lg"] = 24] = "Lg";
        EmotionSize[EmotionSize["Xl"] = 32] = "Xl";
    })(EmotionSize = UI.EmotionSize || (UI.EmotionSize = {}));
    let FilesViewMode;
    (function (FilesViewMode) {
        FilesViewMode["Tiles"] = "tiles";
        FilesViewMode["List"] = "list";
    })(FilesViewMode = UI.FilesViewMode || (UI.FilesViewMode = {}));
    let INotificationType;
    (function (INotificationType) {
        INotificationType["Success"] = "success";
        INotificationType["Error"] = "error";
        INotificationType["Warning"] = "warning";
    })(INotificationType = UI.INotificationType || (UI.INotificationType = {}));
    let IChartLegendPosition;
    (function (IChartLegendPosition) {
        IChartLegendPosition["Left"] = "left";
        IChartLegendPosition["Right"] = "right";
    })(IChartLegendPosition = UI.IChartLegendPosition || (UI.IChartLegendPosition = {}));
    let PopoverPlacement;
    (function (PopoverPlacement) {
        PopoverPlacement["Right"] = "right";
        PopoverPlacement["Left"] = "left";
        PopoverPlacement["Top"] = "top";
        PopoverPlacement["Bottom"] = "bottom";
    })(PopoverPlacement = UI.PopoverPlacement || (UI.PopoverPlacement = {}));
    let ScrollViewDirection;
    (function (ScrollViewDirection) {
        ScrollViewDirection["LatestOnBottom"] = "latestOnBottom";
        ScrollViewDirection["LatestOnTop"] = "latestOnTop";
    })(ScrollViewDirection = UI.ScrollViewDirection || (UI.ScrollViewDirection = {}));
    let TabsPosition;
    (function (TabsPosition) {
        TabsPosition["Top"] = "top";
        TabsPosition["Right"] = "right";
        TabsPosition["Left"] = "left";
    })(TabsPosition = UI.TabsPosition || (UI.TabsPosition = {}));
    let RotationType;
    (function (RotationType) {
        RotationType["Flip"] = "flip";
        RotationType["Spin"] = "spin";
    })(RotationType = UI.RotationType || (UI.RotationType = {}));
    let CodeEditorMode;
    (function (CodeEditorMode) {
        CodeEditorMode["Js"] = "js";
        CodeEditorMode["Css"] = "css";
        CodeEditorMode["Html"] = "html";
        CodeEditorMode["Xml"] = "xml";
    })(CodeEditorMode = UI.CodeEditorMode || (UI.CodeEditorMode = {}));
    let RadioListPosition;
    (function (RadioListPosition) {
        RadioListPosition["Inline"] = "inline";
        RadioListPosition["Vertical"] = "vertical";
    })(RadioListPosition = UI.RadioListPosition || (UI.RadioListPosition = {}));
    let InputType;
    (function (InputType) {
        InputType["String"] = "string";
        InputType["SingleLineString"] = "singleLineString";
        InputType["Integer"] = "integer";
        InputType["Decimal"] = "decimal";
        InputType["Boolean"] = "boolean";
        InputType["Html"] = "html";
        InputType["Date"] = "date";
        InputType["DateTime"] = "dateTime";
        InputType["Options"] = "options";
        InputType["MultiOptions"] = "multiOptions";
    })(InputType = UI.InputType || (UI.InputType = {}));
})(UI || (UI = {}));
