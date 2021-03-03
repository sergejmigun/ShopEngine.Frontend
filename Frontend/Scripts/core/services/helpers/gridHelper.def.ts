namespace Services.Helpers {
    export interface IGridHelper {
        getTextColumn(propName, displayName, css?, other?): any;
        getLinkColumn(propName, displayName, link, containerReady, css?, other?): any;
        getHtmlColumn(propName, displayName, css?, other?): any;
    }
}