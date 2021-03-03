namespace Services {
    export interface IApiService {
        get<T>(url: string, data?): Promise<T>;
        getHtml(url: string, data): Promise<string>;
        getTemplateHtml(templateName: string, area?: string): Promise<string>;
        post<T>(url: string, data): Promise<T>;
        put<T>(url: string, data): Promise<T>;
        delete<T>(url: string, data): Promise<T>;
        getUrl(controller: string, action: string, data): string;
        sendRequest(controller: string, action: string, data, method: string): Promise<any>;
        sendRequestByUrl(url: string, data, method: string): Promise<any>;
    }
}