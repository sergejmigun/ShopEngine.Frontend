namespace Services.WebServer {
    export interface IActionData {
        method: string;
        url: string;
    }

    export interface IControllersHelper {
        init(serviceInst: object, type: string, getAction: (actionData: IActionData) => (data: any) => void): void;
    }
}