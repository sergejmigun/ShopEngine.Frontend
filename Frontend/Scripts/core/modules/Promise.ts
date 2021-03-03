interface IPromiseResult<T> {
    result: T;
}

interface IPromise {
    create<T>(func: (success: (arg?: T) => void, error?: (arg?: any) => void) => void): Promise<T>;
    fromResult<T>(result: T): Promise<T>;
    result<T>(arg: Promise<T>): IPromiseResult<T>;
    all<T>(promises: Array<Promise<T>>): Promise<T[]>;
    empty(): Promise<any>;
}

app.registerModule('Promise', [function () {
    'use strict';

    return {
        module: {
            create: function <T>(success, error?) {
                return new window['Promise'](success, error) as Promise<T>;
            },
            result: function <T>(promise: Promise<T>) {
                var promiseResult = {} as IPromiseResult<T>;

                promise.then(function (result) {
                    promiseResult.result = result;

                    return result;
                });

                return promiseResult;
            },
            fromResult: function (obj) {
                return this.create(function (success) {
                    success(obj);
                });
            },
            all: function (promises, callback) {
                if (!callback) {
                    return window['Promise'].all(promises) as Promise<any>;
                }

                window['Promise'].all(promises).then(function (results) {
                    callback.apply(null, results);
                });
            },
            empty: function () {
                return new window['Promise'](function (success) {
                    success();
                });
            }
        } as IPromise,
        initComponent: function (component) {
            return component;
        }
    };
}]);
