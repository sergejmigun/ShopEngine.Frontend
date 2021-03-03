interface IContainer {
    setContent(content: JQuery | string): void;
    ready?(): Promise<any>;
}

interface IContentProvider {
    getContent(): JQuery;
}