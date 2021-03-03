namespace UI {
    export interface IAccordionPanel {
        title: string;
        content: UI.IUiItemData;
    }

    export interface IAccordionInitData {
        direction: AccordionDirection,
        height: number,
        currentPanelIndex: number,
        panels: IAccordionPanel[]
    }

    export interface IAccordion {
        remove(): void;
    }

    export interface IAccordionFactory {
        init(container: IContainer, initData: UI.IAccordionInitData): Promise<IAccordion>;
    }
}
