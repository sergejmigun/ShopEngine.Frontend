namespace Services {
    export interface ITemplatesHtmlProvider {
        getHtml(templates: string[]): Promise<any>;
    }

    export interface ITemplatesHtmlProviderFactory {
        init(area?: string): ITemplatesHtmlProvider;
    }
}