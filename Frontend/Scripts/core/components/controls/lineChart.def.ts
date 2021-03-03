namespace UI {
    export interface ILineChartDataSet {
        color: string;
        value: number;
        label: string;
        data: any;
    }

    export interface ILineChartInitData {
        showLegend: boolean;
        labels: string[];
        dataSets: BarChartDataSet[];
        direction: BarChartDirection,
        width: number;
        height: number;
        curved: boolean;
        hideStrokes: boolean;
        hidePoints: boolean;
    }

    export interface ILineChart {
        addSeria(label, data): void;
        addDataSet(dataSet: ILineChartDataSet): void;
        changeValue(seriaIndex, dataSetIndex, value): void;
        removeDataSet(dataSetIndex): void;
        removeSeria(seriaIndex): void;
        remove(): void;
    }

    export interface ILineChartFactory {
        init(container: IContainer, initData: ILineChartInitData): Promise<ILineChart>;
    }
}
