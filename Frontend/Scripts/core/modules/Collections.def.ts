interface INameValue<T> {
    name: string;
    value: T;
}

namespace Collections {
    export interface IIntersectionResult {
        first: any[];
        same: any[];
        second: any[];
    }
}

interface ICollections {
    from<T>(elementsSet: Array<T> | IArguments): Enumerable<T>;
    fromObject<T>(elementsSet: { [name: string]: T }): Enumerable<INameValue<T>>;
    where(elementsSet, predicate): Enumerable<any>;
    select(elementsSet, selector): Enumerable<any>;
    selectMany(elementsSet, selector): Enumerable<any>;
    skip(elementsSet, skip): Enumerable<any>;
    take(elementsSet, take): Enumerable<any>;
    selectIndexes(elementsSet, selector): Number[];
    first<T>(elementsSet: T[], predicate?: (arg: T) => boolean): any;
    last(array): any;
    contains(elementsSet, targetItem): boolean;
    foreach<T>(elementsSet: Array<T>, onIterate: (x: T, i: number) => void): void;
    foreach<T>(elementsSet: { [name: string]: T }, onIterate: (value: T, name: string) => void): void;
    safeForeach<T>(elementsSet: Array<T>, onIterate: (x: T, i: number) => void): void;
    indexOf(elementsSet, predicate): number;
    intersect(array1, array2, comparer): Collections.IIntersectionResult;
    repeat(count, func): void;
    repeatArray(array, count): any[];
    copy(fromArray, toArray): void;
    clone(array): any[];
    remove(array, selector): void;
    removeByIndex(array: any[], index: number): void;
    removeSome(array, removedItemsArray): void;
    removeRange(array, from, to?): void;
    removeAll(array): void;
    insert(array, index, item): void;
    orderBy(array, compare): any[];
    orderByDesc(array, compare): any[];
    groupBy(array, keySelector): any[];
    merge(array1, array2): any;
    mergeObjectArrays(array1, array2): any
}