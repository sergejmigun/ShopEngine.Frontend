app.registerComponent('strings', 'Utils', [
    '$',
    'Collections',
    'Lib.objects',
    function ($: JQueryStatic,
        collections: ICollections,
        libObjects) {
        'use strict';

        return {
            join: function (array, separator, selector) {
                var result = '';

                if (!separator) {
                    separator = ', ';
                }

                if (!array) {
                    return result;
                }

                var items = collections.from(array).select(function (item) {
                    return !selector
                        ? item
                        : selector(item);
                }).where(function (item) {
                    return !!item;
                }).toArray();

                collections.foreach(items, function (str, index) {
                    result += str;

                    if (index !== items.length - 1) {
                        result += separator;
                    }
                });

                return result;
            },
            format: function () {
                var regex = new RegExp("{-?[0-9]+}", "g"),
                    args = collections.from(<any>arguments).skip(1).toArray();

                return arguments[0].replace(regex, function (item) {
                    var intVal = parseInt(item.substring(1, item.length - 1), 10),
                        replace;

                    if (intVal >= 0) {
                        replace = args[intVal];
                    } else if (intVal === -1) {
                        replace = "{";
                    } else if (intVal === -2) {
                        replace = "}";
                    } else {
                        replace = "";
                    }

                    return replace;
                });
            },
            formatTags: function (str, formatters) {
                return libObjects.tagsFormatter.format(str, formatters);
            },
            splice: function (currentStr, startIndex, removeLength, insertedStr) {
                return currentStr.slice(0, startIndex) + insertedStr + currentStr.slice(startIndex + Math.abs(removeLength));
            },
            trim: function (str) {
                return $.trim(str);
            },
            capitalizeFirstLetter: function (str) {
                if (!str) {
                    return str;
                }

                return str[0].toUpperCase() + str.substring(1);
            },
            isNullOrWhiteSpace: function (str) {
                if (!str) {
                    return true;
                }

                return !collections.from(<any>str).any(function (symbol) {
                    return symbol !== ' ';
                });
            },
            concat: function () {
                var res = '',
                    args: any = arguments;

                collections.foreach(args, function (str) {
                    res += str;
                });

                return res;
            },
            formatFileSize: function (fileSize) {
                var thresh = 1024;
                if (Math.abs(fileSize) < thresh) {
                    return fileSize + ' B';
                }
                var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                var u = -1;
                do {
                    fileSize /= thresh;
                    ++u;
                } while (Math.abs(fileSize) >= thresh && u < units.length - 1);
                return fileSize.toFixed(1) + ' ' + units[u];
            }
        } as Utils.IStrings;
    }
]);