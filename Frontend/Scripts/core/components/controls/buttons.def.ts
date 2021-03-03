namespace UI {
    export interface IButton {
        disable(): void;
        enable(): void;
        hide(): void;
        show(): void;
        remove(): void;
        setText(text: string): void;
        setIcon(iconCss: string): void;
    }

    export interface IRoundButtonInitData extends IButtonInitDataBase {
        title?: string;
    }

    export interface IButtonInitData extends IButtonInitDataBase {
        element?: any;
        type?: string;
        buttonType?: ButtonType;
        iconCss?: string;
        iconPosition?: ButtonIconPosition;
        text?: string;
        iconColorCss?: string;
        onInit?: (button: IButton) => void;
    }

    export interface IButtonInitDataBase {
        action: (arg?: any) => any;
        css?: string;
        size?: ButtonSize;
        hidden?: boolean;
        disabled?: boolean;
    }

    export interface IButtonsFactory {
        submit(initData: IButtonInitData, container: IContainer): IButton;
        cancel(initData: IButtonInitData, container: IContainer): IButton;
        remove(initData: IButtonInitData, container: IContainer): IButton;
        add(initData: IButtonInitData, container: IContainer): IButton;
        edit(initData: IButtonInitData, container: IContainer): IButton;
        view(initData: IButtonInitData, container: IContainer): IButton;
        back(initData: IButtonInitData, container: IContainer): IButton;
        doAction(initData: IButtonInitData, container: IContainer): IButton;
        roundIcon(iconCss: string, initData: IRoundButtonInitData, container: IContainer): IButton;
        roundText(text: string, initData: IRoundButtonInitData, container: IContainer): IButton;
        link(initData: IButtonInitData, container: IContainer): IButton;
        getData(buttonType: string | ButtonType, initData?: IButtonInitData): IButtonInitData;
    }
}