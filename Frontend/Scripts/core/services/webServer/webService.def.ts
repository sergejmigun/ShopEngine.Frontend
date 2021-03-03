namespace Services {
    export interface IWebResult<T> {
        url: string;
        send(): Promise<T>;
    }

    export interface IWebService {
        navigate(controller: string, action: string, data): void;
        navigateToAction(controller: string, action: string, data): void;
        getUrl(controller: string, action: string, data): string;
        getUrlParams(data): string;
        sendRequest(controller: string, action: string, data, method: string): void;
        sendRequestByUrl(url: string, data, method: string): void;
    }
}