namespace UI {

    export interface IPieChartDataSet {
        color: string;
        value: number;
        label: string;
    }

    export interface IPieChartInitData {
        showLegend: boolean;
        showPercents: boolean;
        doughnut: boolean;
        width: number;
        height: number;
        dataSets: IPieChartDataSet[];
        legendPosition: IChartLegendPosition;
    }

    export interface IPieChart {
        addData(data: IPieChartDataSet, dataIndex: number): void;
        removeData(dataIndex: number): void;
        changeValue(dataIndex: number, value: number): void;
        remove(): void;
        renderComplete(handler: () => void): void;
        click(handler: () => void): void;
    }

    export interface IPieChartFactory {
        init(container: IContainer, initData: UI.IPieChartInitData): Promise<IPieChart>;
    }
}
