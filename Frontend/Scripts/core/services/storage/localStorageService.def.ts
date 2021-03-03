namespace Services {
    export interface ILocalStorageService {
        setItem(key: string, value): any;
        getString(key: string): any;
        getObject(key: string, defaultValue): any;
        removeItem(key: string): any;
        clear(): any;
    }
}