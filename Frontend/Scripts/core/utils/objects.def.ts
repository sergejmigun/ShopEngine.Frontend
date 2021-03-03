namespace Utils {
    export interface IObjects {
        event(): any;
        addEventsHandler(events, handler): void;
        parseJson(json: string): any;
        serializeToJson(obj): string;
        createAndMap(sourceObj, mapping): any;
        createAndMapArray(sourceArray: Array<any>, mapping): Array<any>;
        map(sourceObj, targetObj, mapping?): void;
        extend<T>(sourceObj, targetObj: T, overwrite?: boolean): T;
        clone<T>(obj: T): T;
        isObject(obj): boolean;
        isArray(obj): boolean;
        isFunction(obj): boolean;
        isNumeric(obj): boolean;
        isString(obj): boolean;
        isDate(obj): boolean;
        isJQueryObj(obj): boolean;
        isPromise(obj): boolean;
        isNullOrUndefined(obj): boolean;
        isEmptyArray(array: Array<any>): boolean;
        compareValues(value1, value2): number;
        moveArrayItem(array, oldIndex, newIndex): void;
        tryGet<T>(object, prop: string, defaultValue?): T;
        tryCall(object, func: string, ...args): void;
        getGuid(): string;
        checkValue(value, availableValues, defaultValue): any;
        stringsEquals(arg1, arg2): boolean;
        getLocalizedText(localizedValue, language: string): string;
        parseObjectsPath(path): any;
        is(obj, type): boolean;
        allAreTrue(): boolean;
        setValue(obj, path: string, value): void;
        areSame(obj1, obj2): boolean;
        extendFunction(obj: object, funcName: string, func: (...args) => any);
    }
}