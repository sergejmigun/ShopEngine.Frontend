namespace UI {

    export interface INotifierInitData {
        delay: number | string;
    }

    export interface INotifier {
        notify(message: string, type?: INotificationType): void;
    }

    export interface INotifierFactory {
        init(initData?: INotifierInitData): Promise<INotifier>;
        getCurrent(): INotifier;
        notify(message: string, type?: INotificationType): void;
    }
}