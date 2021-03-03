namespace Services.Charts {
    export interface IChartHelper {
        getBasicChartJsOptions(events): any;
        appendToLegend($legend: JQuery, label: string, color: string, containerReady: Promise<any>): void;
        placeLegend($wrapper: JQuery, $legend: JQuery, chartOptions): void;
        initLegend($wrapper: JQuery, $legend: JQuery, chartOptions): void;
        removeFromLegend($legend: JQuery, index: number): void;
    }
}