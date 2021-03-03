namespace Services {
    export interface IContainerHelper {
        replace($el: JQuery, parentReady: Promise<any>, beforeSetContentAction?: () => void): IContainer;
        appendTo($container: JQuery, parentReady: Promise<any>, beforeSetContentAction?: () => void): IContainer;
        prependTo($container: JQuery, parentReady: Promise<any>, beforeSetContentAction?: () => void): IContainer;
        custom(func: (content: string | JQuery) => void, parentReady: Promise<any>, beforeSetContentAction?: () => void): IContainer;
        provide($container: JQuery): IContentProvider;
        extractContainer(container: IContainer): IContainer;
    }
}