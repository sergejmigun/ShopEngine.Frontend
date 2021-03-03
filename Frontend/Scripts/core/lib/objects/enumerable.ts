class Enumerable<T> {
    private $iterate: (func: (x: T) => any) => void;
    private utils;

    constructor($iterate: (func: (x: T) => any) => void, utils) {
        this.$iterate = $iterate;
        this.utils = utils;
    }

    public where(predicate: (x: T) => boolean) {
        var self = this;

        return new Enumerable<T>(function (onIterate) {
            self.$iterate(function (item) {
                if (predicate(item)) {
                    onIterate(item);
                }
            });
        }, this.utils);
    };

    public select<TOut>(selector: (x: T, index: number) => TOut) {
        var self = this;

        return new Enumerable<TOut>(function (onIterate) {
            var index = 0;

            self.$iterate(function (item) {
                onIterate(selector(item, index));
                index += 1;
            });
        }, this.utils);
    };

    public selectMany<TOut>(selector: (x: T) => Array<TOut>) {
        var self = this;

        return new Enumerable<TOut>(function (onIterate) {
            self.$iterate(function (item: T) {
                var set = selector(item);

                if (set) {
                    set.forEach(function (innerItem) {
                        onIterate(innerItem);
                    });
                }
            });
        }, this.utils);
    };

    public groupBy(selector: (x: T) => any) {
        var self = this;

        return new Enumerable<{ key: string, items: T[] }>(function (onIterate) {
            var group = {};

            self.$iterate(function (item: T) {
                var key = selector(item);

                if (!group.hasOwnProperty(key)) {
                    group[key] = [];
                }

                group[key].push(item);
            });

            for (var key in group) {
                onIterate({
                    key: key,
                    items: group[key]
                });
            }
        }, this.utils);
    };

    public skip(skip: number) {
        var self = this;

        return new Enumerable<T>(function (onIterate) {
            var index = 0;

            self.$iterate(function (item) {
                if (index >= skip) {
                    onIterate(item);
                }

                index += 1;
            });
        }, this.utils);
    };

    public take(take: number) {
        var self = this;

        return new Enumerable<T>(function (onIterate) {
            var index = 0;

            self.$iterate(function (item) {
                if (index < take) {
                    onIterate(item);
                }

                index += 1;
            });
        }, this.utils);
    };

    public foreach(onIterate: (x: T, i: number) => void) {
        var index = 0;

        this.$iterate(function (item) {
            onIterate(item, index);
            index += 1;
        });
    };

    public first(predicate?: (x: T) => boolean) {
        var first: T;

        this.$iterate(function (item) {
            if (!predicate || predicate(item)) {
                first = item;

                return false;
            }
        });

        return first;
    };

    public selectIndexes(predicate) {
        var resultIndexes: number[] = [],
            self = this,
            index = 0;

        this.$iterate(function (item) {
            var isFunction = self.utils.objects.isFunction(predicate);

            if ((isFunction && predicate(item)) || (!isFunction && predicate === item)) {
                resultIndexes.push(index);
            }

            index += 1;
        });

        return resultIndexes;
    };

    public indexOf(predicate) {
        var resultIndex = -1,
            self = this,
            index = 0;

        this.$iterate(function (item) {
            var isFunction = self.utils.objects.isFunction(predicate);

            if ((isFunction && predicate(item)) || (!isFunction && predicate === item)) {
                resultIndex = index;

                return false;
            }

            index += 1;
        });

        return resultIndex;
    };

    public any(predicate: (x: T) => boolean) {
        var any = false;

        this.$iterate(function (item) {
            if (!predicate || predicate(item)) {
                any = true;

                return false;
            }
        });

        return any;
    };

    public all(predicate: (x: T) => boolean) {
        var all = true;

        this.$iterate(function (item) {
            if (!predicate(item)) {
                all = false;

                return false;
            }
        });

        return all;
    };

    public contains(targetItem) {
        var contains = false;

        this.$iterate(function (item) {
            if (targetItem === item) {
                contains = true;

                return false;
            }
        });

        return contains;
    };

    public count() {
        var count = 0;

        this.$iterate(function () {
            count += 1;
        });

        return count;
    };

    public toArray() {
        var arr: T[] = [];

        this.$iterate(function (item) {
            arr.push(item);
        });

        return arr;
    };

    public toObject<T>(propertySelector: (item: any) => INameValue<T>) {
        var obj = {};

        this.$iterate(function (item) {
            var propInfo = propertySelector(item);

            obj[propInfo.name] = propInfo.value;
        });

        return obj;
    };
}

app.registerComponent('enumerable', 'Lib.objects', ['Utils', function (utils) {
    'use strict';

    return {
        init: function ($iterate) {
            return new Enumerable($iterate, utils);
        }
    };
}]);