namespace Utils {
    export interface IDom {
        getSelectionText(): string;
        getOuterHtml($el: JQuery): string;
        htmlEncode(html: string): string;
        htmlDecode(text: string): string;
        cutHtml($container: JQuery): string;
        cutOuterHtml($container: JQuery): string;
        toContainerData($wrapper: JQuery, mode): IContainer;
        insertAtCursor(fieldControl, value: string): void;
        setViewState($el: JQuery, hideCondition: boolean): void;
        removeCssProperty($el: JQuery, cssProp: string): void;
    }
}