app.registerModule('Collections', ['$', 'Lib.objects.enumerable', function ($, enumerable) {
    'use strict';

    function getArrayEumeration<T>(elementsSet: Array<T>) {
        if (!elementsSet) {
            elementsSet = [];
        }

        return enumerable.init(function (onIterate) {
            for (var i = 0; i < elementsSet.length; i += 1) {
                if (onIterate(elementsSet[i]) === false) {
                    break;
                }
            }
        }) as Enumerable<T>;
    }

    function getObjectEnumeration<T>(elementsSet: { [name: string]: T }) {
        if (!elementsSet) {
            elementsSet = {};
        }

        return enumerable.init(function (onIterate) {
            var keys = Object.keys(elementsSet),
                falseIteration;

            for (var i = 0; i < keys.length; i += 1) {
                falseIteration = onIterate({
                    name: keys[i],
                    value: elementsSet[keys[i]]
                }) === false;

                if (falseIteration) {
                    break;
                }
            }
        }) as Enumerable<INameValue<T>>;
    }

    function getEnumeration(elementsSet) {
        if (!elementsSet || $.isArray(elementsSet)) {
            return getArrayEumeration(elementsSet);
        }

        return getObjectEnumeration(elementsSet);
    }

    return {
        module: {
            from: function<T> (elementsSet: Array<T>) {
                return getArrayEumeration(elementsSet);
            },
            fromObject: function<T> (elementsSet: { [name: string]: T }) {
                return getObjectEnumeration(elementsSet);
            },
            where: function (elementsSet, predicate) {
                return getEnumeration(elementsSet).where(predicate);
            },
            select: function (elementsSet, selector) {
                return getEnumeration(elementsSet).select(selector);
            },
            selectMany: function (elementsSet, selector) {
                return getEnumeration(elementsSet).selectMany(selector);
            },
            selectIndexes: function (elementsSet, selector) {
                return getEnumeration(elementsSet).selectIndexes(selector);
            },
            skip: function (elementsSet, skip) {
                return getEnumeration(elementsSet).skip(skip);
            },
            take: function (elementsSet, take) {
                return getEnumeration(elementsSet).take(take);
            },
            first: function (elementsSet, predicate) {
                return getEnumeration(elementsSet).first(predicate);
            },
            last: function (array) {
                if (!array.length) {
                    return;
                }

                return array[array.length - 1];
            },
            contains: function (elementsSet, targetItem) {
                return getEnumeration(elementsSet).contains(targetItem);
            },
            foreach: function (elementsSet, onIterate) {
                var i;

                if (elementsSet.foreach) {
                    elementsSet.foreach(onIterate);
                } else if (elementsSet.length) {
                    for (i = 0; i < elementsSet.length; i += 1) {
                        if (onIterate(elementsSet[i], i) === false) {
                            break;
                        }
                    }
                } else {
                    var keys = Object.keys(elementsSet);

                    for (i = 0; i < keys.length; i += 1) {
                        if (onIterate(elementsSet[keys[i]], keys[i]) === false) {
                            break;
                        }
                    }
                }
            },
            safeForeach: function (elementsSet, onIterate) {
                var hasItems = false;

                if (elementsSet) {
                    this.foreach(elementsSet, function () {
                        hasItems = true;

                        if (onIterate) {
                            onIterate.apply(this, arguments);
                        }
                    });
                }

                return hasItems;
            },
            indexOf: function (elementsSet, predicate) {
                return getEnumeration(elementsSet).indexOf(predicate);
            },
            intersect: function (array1, array2, comparer) {
                var module = this,
                    result = {
                        first: [],
                        same: [],
                        second: []
                    };

                module.foreach(array1, function (array1Item) {
                    var sameItem = module.first(array2, function (array2Item) {
                        return comparer
                            ? comparer(array1Item, array2Item)
                            : array1Item === array2Item;
                    });

                    if (sameItem) {
                        result.same.push(sameItem);
                    } else {
                        result.first.push(array1Item);
                    }
                });

                module.foreach(array2, function (array2Item) {
                    if (!module.contains(result.same, array2Item)) {
                        result.second.push(array2Item);
                    }
                });

                return result;
            },
            repeat: function (count, func) {
                var i;
                for (i = 0; i < count; i += 1) {
                    if (func(i + 1) === false) {
                        break;
                    }
                }
            },
            repeatArray: function (array, count) {
                var i,
                    result = [];

                for (i = 0; i < count; i += 1) {
                    result = result.concat(array);
                }

                return result;
            },
            copy: function (fromArray, toArray) {
                this.safeForeach(fromArray, function (item) {
                    toArray.push(item);
                });
            },
            clone: function (array) {
                if (!array) {
                    return;
                }

                var result = [];

                this.copy(array, result);

                return result;
            },
            remove: function (array, selector) {
                if (!array) {
                    return;
                }

                var index = this.indexOf(array, selector);

                while (index !== -1) {
                    array.splice(index, 1);
                    index = this.indexOf(array, selector);
                }
            },
            removeByIndex: function (array, index) {
                if (!array) {
                    return;
                }

                if (index >= 0 && index < array.length) {
                    array.splice(index, 1);
                }
            },
            removeSome: function (array, removedItemsArray) {
                if (!array || !removedItemsArray) {
                    return;
                }

                var module = this;

                module.foreach(removedItemsArray, function (item) {
                    module.remove(array, item);
                });
            },
            removeRange: function (array, from, to) {
                if (!array || from >= array.length) {
                    return;
                }

                if (!to || to >= array.length || to <= from) {
                    to = array.length - 1;
                }

                array.splice(from, from - to);
            },
            removeAll: function (array) {
                array.length = 0;
            },
            insert: function (array, index, item) {
                array.splice(index, 0, item);
            },
            orderBy: function (array, compare) {
                return array.sort(compare);
            },
            orderByDesc: function (array, compare) {
                return array.sort(function (a, b) {
                    return compare(a, b) * (-1);
                });
            },
            groupBy: function (array, keySelector) {
                var self = this,
                    groups = [];

                self.safeForeach(array, function (arrayItem) {
                    var key = keySelector(arrayItem),
                        group = self.first(groups, function (groupItem) {
                            return groupItem.key === key;
                        });

                    if (group) {
                        group.items.push(arrayItem);
                    } else {
                        groups.push({
                            key: key,
                            items: [arrayItem]
                        });
                    }
                });

                return groups;
            },
            merge: function (array1, array2) {
                var result = {
                    first: [],
                    second: [],
                    both: []
                };

                var array1Set = {},
                    module = this;

                module.foreach(array1, function (array1Item) {
                    array1Set[array1Item] = array1Item;
                });

                module.foreach(array2, function (array2Item) {
                    if (array1Set.hasOwnProperty(array2Item.toString())) {
                        result.both.push(array2Item);
                        delete array1Set[array2Item.toString()];
                    } else {
                        result.second.push(array2Item.toString());
                    }
                });

                result.first = module.from(array1Set).select(function (array1Item) {
                    return array1Item.value;
                }).toArray();

                return result;
            },
            mergeObjectArrays: function (array1, array2) {
                var result = {
                    first: [],
                    second: [],
                    both: []
                };

                var array1IncludedIndexes = {},
                    module = this;

                module.foreach(array2, function (array2Item) {
                    var array1ItemIndex = module.indexOf(array1, array2Item);

                    if (array1ItemIndex !== -1) {
                        result.both.push(array2Item);
                        array1IncludedIndexes[array1ItemIndex] = array1ItemIndex;
                    } else {
                        result.second.push(array2Item);
                    }
                });

                module.foreach(array1, function (array1Item, index) {
                    if (!array1IncludedIndexes.hasOwnProperty(index.toString())) {
                        result.first.push(array1Item);
                    }
                });

                return result;
            },
            hasItems: function (arr) {
                return arr && arr.length > 0;
            }
        } as ICollections,
        initComponent: function (component) {
            return component;
        }
    };
}]);