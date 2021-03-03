app.registerComponent('objects', 'Utils', [
    '$',
    'Lib',
    'Collections',
    function ($: JQueryStatic, lib, collections: ICollections) {
        'use strict';

        return {
            event: function () {
                return lib.objects.event.init();
            },
            addEventsHandler: function (events: any[], handler) {
                collections.foreach(events, function (event) {
                    event(handler);
                });
            },
            parseJson: function (json) {
                return $.parseJSON(json);
            },
            serializeToJson: function (obj) {
                return JSON.stringify(obj);
            },
            createAndMap: function (sourceObj, mapping) {
                var targetObj = {};

                this.map(sourceObj, targetObj, mapping);

                return targetObj;
            },
            createAndMapArray: function (sourceArray, mapping) {
                var targetArray = [],
                    module = this;

                collections.safeForeach(sourceArray, function (sourceObj) {
                    var targetObj = {};

                    targetArray.push(targetObj);
                    module.map(sourceObj, targetObj, mapping);
                });

                return targetArray;
            },
            map: function (sourceObj, targetObj, mapping) {
                lib.objects.mapper.map(sourceObj, targetObj, mapping);

                return targetObj;
            },
            extend: function (sourceObj, targetObj, overwrite) {
                if (overwrite === undefined) {
                    overwrite = true;
                }

                Object.keys(sourceObj).forEach(function (sourceProp) {
                    if (overwrite || !targetObj.hasOwnProperty(sourceProp) || targetObj[sourceProp] === undefined) {
                        targetObj[sourceProp] = sourceObj[sourceProp];
                    }
                });

                return targetObj;
            },
            clone: function (obj) {
                if (this.isNullOrUndefined(obj)) {
                    return;
                }

                var module = this;

                function clone(obj) {
                    var copy;

                    if (null === obj || 'object' !== typeof obj || module.isJQueryObj(obj) || module.isPromise(obj)) {
                        return obj;
                    }

                    if (module.is(obj, Date)) {
                        copy = new Date();
                        copy.setTime(obj.getTime());

                        return copy;
                    }

                    if (module.is(obj, Array)) {
                        copy = [];

                        var i,
                            len = obj.length;

                        for (i = 0; i < len; i += 1) {
                            copy[i] = clone(obj[i]);
                        }

                        return copy;
                    }

                    if (module.is(obj, Object)) {
                        copy = {};

                        var i2 = 0,
                            keys = Object.keys(obj);

                        for (i2 = 0; i2 < keys.length; i2 += 1) {
                            copy[keys[i2]] = clone(obj[keys[i2]]);
                        }

                        return copy;
                    }

                    // is primitive
                    return obj;
                }

                return clone(obj);
            },
            isObject: function (obj) {
                return $.isPlainObject(obj);
            },
            isArray: function (obj) {
                return $.isArray(obj);
            },
            isFunction: function (obj) {
                return $.isFunction(obj);
            },
            isNumeric: function (obj) {
                return $.isNumeric(obj);
            },
            isString: function (str) {
                return typeof str === 'string' || this.is(str, String);
            },
            isDate: function (obj) {
                return this.is(obj, Date);
            },
            isJQueryObj: function (obj) {
                return this.is(obj, $);
            },
            isPromise: function (obj) {
                return this.is(obj, window['Promise']);
            },
            isNullOrUndefined: function (obj) {
                return obj === null || obj === undefined;
            },
            isEmptyArray: function (array) {
                return !array || !array.length;
            },
            compareValues: function (value1, value2) {
                if (value1 > value2) {
                    return 1;
                }

                if (value1 < value2) {
                    return -1;
                }

                return 0;
            },
            moveArrayItem: function (array, oldIndex, newIndex) {
                while (oldIndex < 0) {
                    oldIndex += array.length;
                }

                while (newIndex < 0) {
                    newIndex += array.length;
                }

                if (newIndex >= array.length) {
                    var k = newIndex - array.length;

                    while (k) {
                        array.push(undefined);
                        k = k - 1;
                    }
                }

                array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
            },
            tryGet: function (object, prop, defaultValue) {
                if (this.isNullOrUndefined(object)) {
                    return defaultValue;
                }

                for (var objProp in object) {
                    if (prop === objProp) {
                        return object[prop];
                    }
                }

                return defaultValue;
            },
            tryCall: function (object, func) {
                var args = Array.prototype.slice.call(arguments, 2);

                if (object[func]) {
                    object[func].apply(object, args);
                }
            },
            getGuid: function () {
                var s = function () {
                    var rand = (1 + Math.random()) * 0x10000 | 0;

                    return rand.toString(16).substring(1);
                };

                return s() + s() + '-' + s() + '-' + s() + '-' + s() + '-' + s() + s() + s();
            },
            checkValue: function (value, availableValues, defaultValue) {
                var result;

                collections.foreach(availableValues, function (availableValue) {
                    if (value === availableValue) {
                        result = value;
                        return;
                    }
                });

                if (result === undefined) {
                    result = defaultValue === undefined
                        ? availableValues[0]
                        : defaultValue;
                }

                return result;
            },
            stringsEquals: function (arg1, arg2) {
                if (!this.isNullOrUndefined(arg1) && !this.isNullOrUndefined(arg2)) {
                    return arg1.toString() === arg2.toString();
                }

                return arg1 === arg2;
            },
            getLocalizedText: function (localizedValue, language) {
                if (!localizedValue || !localizedValue.length) {
                    return '';
                }

                if (!language) {
                    return localizedValue[0].Text;
                }

                return collections.from<any>(localizedValue).where(function (localizedValueItem) {
                    return localizedValueItem.Language === language;
                }).select(function (localizedValueItem) {
                    return localizedValueItem.Text;
                }).first();
            },
            parseObjectsPath: function (path) {
                return lib.objects.objectsPathParser.parse(path);
            },
            is: function (obj, type) {
                return obj instanceof type;
            },
            allAreTrue: function () {
                return collections.from(<any>arguments).all(function (arg) {
                    return !!arg;
                });
            },
            setValue: function (obj, path, value) {
                var self = this,
                    pathParts = path.split('.'),
                    targetObj = obj;

                if (pathParts.length > 1) {
                    for (var i = 0; i < pathParts.length - 1; i++) {
                        if (!(pathParts[i] in targetObj && self.isObject(targetObj[pathParts[i]]))) {
                            targetObj[pathParts[i]] = {};
                        }

                        targetObj = targetObj[pathParts[i]];
                    }
                }

                targetObj[pathParts[pathParts.length - 1]] = value;
            },
            areSame: function (obj1, obj2) {
                return JSON.stringify(obj1) === JSON.stringify(obj2);
            },
            extendFunction: function (obj, funcName, func) {
                var currentFunction = obj[funcName];

                obj[funcName] = function () {
                    currentFunction.apply(obj, arguments);
                    func.apply(obj, arguments);
                }
            }
        } as Utils.IObjects;
    }
]);