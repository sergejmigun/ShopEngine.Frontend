namespace Utils {
    export interface IUrls {
        getFullUrl(url: string, parameters?: object): string;
        navigate(url: string, parameters?: object): void;
        setActionUrlHash(url: string, pushToStack?: boolean): void;
        setParamsUrlHash(parameters, pushToStack?: boolean): void;
        createParamsHashString(parameters): string;
        getParamsFromUrlHash(): object;
        getParamFromUrlHash(paramName: string): string;
        addParamToUrlHash(name: string, value): void;
        removeParamFromUrlHash(name: string): void;
        pushUrlHash(hash: string): void;
        popUrlHash(): void;
        clearUrlHash(): void;
        addParam(url: string, name: string, value): string;
        wrapArrayRequestAsSingle(arrayRequest): (arg) => Promise<any>;
    }
}