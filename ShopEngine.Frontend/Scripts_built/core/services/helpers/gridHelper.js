app.registerComponent('gridHelper', 'Services', [
    '$',
    'UI.truncatedText',
    'Services.containerHelper',
    'Utils.objects',
    function ($, truncatedText, containerHelper, objects) {
        'use strict';
        function getColumn(propName, displayName, css, other, cellInitializer) {
            return {
                header: {
                    name: propName,
                    text: displayName,
                    css: css
                },
                cellInitializer: cellInitializer,
                sortable: objects.tryGet(other, 'sortable')
            };
        }
        return {
            getTextColumn: function (propName, displayName, css, other) {
                return getColumn(propName, displayName, css, other, function (data, row) {
                    var format = objects.tryGet(other, 'format'), text = format
                        ? format(data, row)
                        : data[propName];
                    if (!objects.isString(text)) {
                        text = objects.isNullOrUndefined(text)
                            ? ''
                            : text.toString();
                    }
                    return {
                        text: text
                    };
                });
            },
            getLinkColumn: function (propName, displayName, link, containerReady, css, other) {
                return getColumn(propName, displayName, css, other, function (data, row) {
                    var url = link(data), format = objects.tryGet(other, 'format'), text = format
                        ? format(data, row)
                        : data[propName];
                    if (url) {
                        var $a = $('<a>')
                            .attr('href', link(data))
                            .attr('target', objects.tryGet(other, 'target', '_blank'));
                        truncatedText.init(containerHelper.appendTo($a, containerReady), {
                            text: text
                        });
                        return {
                            html: $a
                        };
                    }
                    return {
                        text: text
                    };
                });
            },
            getHtmlColumn: function (propName, displayName, css, other) {
                return getColumn(propName, displayName, css, other, function (data, row) {
                    return {
                        html: other.content(data, row)
                    };
                });
            }
        };
    }
]);
