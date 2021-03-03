namespace Services {
    export interface IErrorHandler {
        handle(response): any;
    }
}