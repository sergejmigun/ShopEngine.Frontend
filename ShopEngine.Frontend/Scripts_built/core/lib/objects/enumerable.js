class Enumerable {
    constructor($iterate, utils) {
        this.$iterate = $iterate;
        this.utils = utils;
    }
    where(predicate) {
        var self = this;
        return new Enumerable(function (onIterate) {
            self.$iterate(function (item) {
                if (predicate(item)) {
                    onIterate(item);
                }
            });
        }, this.utils);
    }
    ;
    select(selector) {
        var self = this;
        return new Enumerable(function (onIterate) {
            var index = 0;
            self.$iterate(function (item) {
                onIterate(selector(item, index));
                index += 1;
            });
        }, this.utils);
    }
    ;
    selectMany(selector) {
        var self = this;
        return new Enumerable(function (onIterate) {
            self.$iterate(function (item) {
                var set = selector(item);
                if (set) {
                    set.forEach(function (innerItem) {
                        onIterate(innerItem);
                    });
                }
            });
        }, this.utils);
    }
    ;
    groupBy(selector) {
        var self = this;
        return new Enumerable(function (onIterate) {
            var group = {};
            self.$iterate(function (item) {
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
    }
    ;
    skip(skip) {
        var self = this;
        return new Enumerable(function (onIterate) {
            var index = 0;
            self.$iterate(function (item) {
                if (index >= skip) {
                    onIterate(item);
                }
                index += 1;
            });
        }, this.utils);
    }
    ;
    take(take) {
        var self = this;
        return new Enumerable(function (onIterate) {
            var index = 0;
            self.$iterate(function (item) {
                if (index < take) {
                    onIterate(item);
                }
                index += 1;
            });
        }, this.utils);
    }
    ;
    foreach(onIterate) {
        var index = 0;
        this.$iterate(function (item) {
            onIterate(item, index);
            index += 1;
        });
    }
    ;
    first(predicate) {
        var first;
        this.$iterate(function (item) {
            if (!predicate || predicate(item)) {
                first = item;
                return false;
            }
        });
        return first;
    }
    ;
    selectIndexes(predicate) {
        var resultIndexes = [], self = this, index = 0;
        this.$iterate(function (item) {
            var isFunction = self.utils.objects.isFunction(predicate);
            if ((isFunction && predicate(item)) || (!isFunction && predicate === item)) {
                resultIndexes.push(index);
            }
            index += 1;
        });
        return resultIndexes;
    }
    ;
    indexOf(predicate) {
        var resultIndex = -1, self = this, index = 0;
        this.$iterate(function (item) {
            var isFunction = self.utils.objects.isFunction(predicate);
            if ((isFunction && predicate(item)) || (!isFunction && predicate === item)) {
                resultIndex = index;
                return false;
            }
            index += 1;
        });
        return resultIndex;
    }
    ;
    any(predicate) {
        var any = false;
        this.$iterate(function (item) {
            if (!predicate || predicate(item)) {
                any = true;
                return false;
            }
        });
        return any;
    }
    ;
    all(predicate) {
        var all = true;
        this.$iterate(function (item) {
            if (!predicate(item)) {
                all = false;
                return false;
            }
        });
        return all;
    }
    ;
    contains(targetItem) {
        var contains = false;
        this.$iterate(function (item) {
            if (targetItem === item) {
                contains = true;
                return false;
            }
        });
        return contains;
    }
    ;
    count() {
        var count = 0;
        this.$iterate(function () {
            count += 1;
        });
        return count;
    }
    ;
    toArray() {
        var arr = [];
        this.$iterate(function (item) {
            arr.push(item);
        });
        return arr;
    }
    ;
    toObject(propertySelector) {
        var obj = {};
        this.$iterate(function (item) {
            var propInfo = propertySelector(item);
            obj[propInfo.name] = propInfo.value;
        });
        return obj;
    }
    ;
}
app.registerComponent('enumerable', 'Lib.objects', ['Utils', function (utils) {
        'use strict';
        return {
            init: function ($iterate) {
                return new Enumerable($iterate, utils);
            }
        };
    }]);
