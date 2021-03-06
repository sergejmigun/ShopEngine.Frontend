app.registerComponent('dates', 'Utils', [
    'Utils',
    function (utils) {
        'use strict';
        var defaultDateTimeFormat = 'MMMM Do YYYY, h:mm:ss a', defaultDateFormat = 'MMMM Do YYYY', defaultTimeFormat = 'h:mm:ss a';
        return {
            getDefaultDateTimeFormat: function () {
                return defaultDateTimeFormat;
            },
            getDefaultDateFormat: function () {
                return defaultDateFormat;
            },
            getDefaultTimeFormat: function () {
                return defaultTimeFormat;
            },
            format: function (date, format) {
                format = format || defaultDateTimeFormat;
                return window['moment'](date).format(format);
            },
            formatDate: function (date, format) {
                format = format || defaultDateFormat;
                return window['moment'](date).format(format);
            },
            formatTime: function (timeObj, format) {
                var dateObj;
                if (utils.objects.isString(timeObj)) {
                    dateObj = window['moment'](timeObj).toDate();
                }
                else if (utils.objects.is(timeObj, Date)) {
                    dateObj = timeObj;
                }
                else {
                    var time = timeObj;
                    dateObj = new Date(2000, 1, 1, time.hours, time.minutes, time.seconds);
                }
                format = format || defaultTimeFormat;
                return window['moment'](dateObj).format(format);
            },
            toSystemFormat: function (date) {
                return window['moment'](date).format();
            },
            parse: function (dateStr) {
                return window['moment'](dateStr).toDate();
            },
            tryParse: function (dateStr) {
                try {
                    return window['moment'](dateStr).toDate();
                }
                catch (ignore) {
                    return false;
                }
            },
            areSameDates: function (date1, date2) {
                var res = window['moment'](date1).isSame(window['moment'](date2), 'd');
                return res;
            },
            areSameDateTime: function (date1, date2) {
                return window['moment'](date1).isSame(window['moment'](date2));
            }
        };
    }
]);
