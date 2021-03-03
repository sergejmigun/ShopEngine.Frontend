namespace UI {
    export interface IDropDownMenuButtonData extends IButtonInitData {
        action(data?: any): void;
        data?: any;
        disabled?: boolean;
    }

    export interface IDropDownMenuInitData {
        currentItemButton?: IDropDownMenuButtonData;
        items: IDropDownMenuButtonData[];
        size?: ButtonSize;
        customDropDownToggleButtonHtml?: string;
        dropDownToggleButtonCss?: string;
        position?: DropDownMenuPostion;
    }

    export interface IDropDownMenu {
        remove(): void;
        itemClick(handler: (data: any) => void): void;
    }

    export interface IDropDownMenuFactory {
        init(container: IContainer, initData: IDropDownMenuInitData): Promise<IDropDownMenu>;
    }
}