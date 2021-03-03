namespace UI {
    export interface IModalOptions {
        large?: boolean;
        buttons?: JQuery[];
    }

    export interface IModalConfirmation {
        title: string | JQuery;
        message: string;
        template?: Components.ITemplateInitData<any, any>;
    }

    export interface IModal {
        close(): void;
        onClose(handler: () => void): void;
    }

    export interface IModalsFactory {
        confirm(confirmation: IModalConfirmation): Promise<any>;
        openSubmit(title: string | JQuery, $content: string | JQuery): void;
        openCustom(title: string | JQuery, $content: string | JQuery, options?: IModalOptions): Promise<IModal>;
    }
}