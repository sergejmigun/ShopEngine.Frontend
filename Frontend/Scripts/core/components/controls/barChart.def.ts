namespace UI {
    export interface BarChartDataSet {
        color: string;
        label: string;
        data: any;
    }

    export interface IBarChartInitData {
        showLegend: boolean;
        labels: string[];
        dataSets: BarChartDataSet[];
        direction: BarChartDirection,
        width: number;
        height: number;
    }

    export interface IBarChart {
        addSeria(label, data): void;
        addDataSet(dataSet): void;
        changeValue(seriaIndex: number, dataSetIndex: number, value: number): void;
        removeDataSet(dataSetIndex): void;
        removeSeria(seriaIndex): void;
        remove(): void;
    }

    export interface IBarChartFactory {
        init(container: IContainer, initData: UI.IBarChartInitData): Promise<IBarChart>;
    }
}
