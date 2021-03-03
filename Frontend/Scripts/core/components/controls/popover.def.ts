namespace UI {

    export interface IPopoverInitData {
        content: JQuery;
        placement: PopoverPlacement;
        title?: string;
        trigger?: string;
        hideOnContentClick?: boolean;
        hideOnBodyClick?: boolean;
    }

    export interface IPopover {
        show(): void;
        hide(): void;
        destroy(): void;
        pageChanged(handler: () => void): void;
    }

    export interface IPopoverFactory {
        init(container: IContainer, initData: IPopoverInitData): Promise<IPopover>;
    }
}