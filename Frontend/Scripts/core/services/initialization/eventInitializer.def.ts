namespace Services.Initialization {
    export interface IEventInitResult<T> {
        event: (handler: (arg: T) => void) => void;
        invoke: (arg: T) => void;
    }

    export interface IEventInitResult2<T1, T2> {
        event: (handler: (arg1: T1, arg2: T2) => void) => void;
        invoke: (arg1: T1, arg2: T2) => void;
    }

    export interface IVoidEventInitResult {
        event: (handler: () => void) => void;
        invoke: () => void;
    }

    export interface IEventsInitializer {
        init(object: any, events: string[]): any;
        initEvent<T>(): IEventInitResult<T>;
        initEvent<T1, T2>(): IEventInitResult2<T1, T2>;
        initVoidEvent(): IVoidEventInitResult;
    }
}