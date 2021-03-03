app.registerComponent('dom', 'Utils', [
    '$',
    'Shared',
    function ($: JQueryStatic, shared) {
        'use strict';

        var dom: Utils.IDom = {
            getSelectionText: function () {
                var text = '';

                if (shared.window.getSelection) {
                    text = shared.window.getSelection().toString();
                } else if (shared.document.selection && shared.document.selection.type !== "Control") {
                    text = shared.document.selection.createRange().text;
                }

                return text;
            },
            getOuterHtml: function ($el) {
                return $el.clone().wrap('<p>').parent().html();
            },
            htmlEncode: function (html) {
                return $('<div />').text(html).html();
            },
            htmlDecode: function (text) {
                return $('<div/>').html(text).text();
            },
            cutHtml: function ($container) {
                var html = $container.html();
                $container.html('');

                return html;
            },
            cutOuterHtml: function ($container) {
                var $parent = $container.parent(),
                    html = $parent.html();

                $parent.html('');

                return html;
            },
            toContainerData: function ($wrapper, mode) {
                return {
                    setContent: function (content) {
                        ($wrapper as any)[mode || 'html'](content);
                    }
                };
            },
            insertAtCursor: function (fieldControl, value) {
                //IE support
                if (shared.document.selection) {
                    fieldControl.focus();
                    var sel = shared.document.selection.createRange();

                    sel.text = value;
                } else if (fieldControl.selectionStart || fieldControl.selectionStart === 0) {
                    // MOZILLA and othres
                    var startPos = fieldControl.selectionStart,
                        endPos = fieldControl.selectionEnd;

                    fieldControl.value = fieldControl.value.substring(0, startPos)
                        + value
                        + fieldControl.value.substring(endPos, fieldControl.value.length);
                } else {
                    fieldControl.value += value;
                }
            },
            setViewState: function ($element, hideCondition) {
                if (hideCondition) {
                    $element.hide();
                } else {
                    $element.show();
                }
            },
            removeCssProperty: function ($el, cssProp) {
                var styles = {},
                    styleStr = $el.attr('style');

                styleStr.split(';').forEach(function (style) {
                    if (style && style.length) {
                        var keyValue = style.split(':');

                        styles[$.trim(keyValue[0])] = $.trim(keyValue[1]);
                    }
                });

                delete styles[cssProp];
                styleStr = '';

                for (var style in styles) {
                    styleStr += (style + ':' + styles[style] + ';');
                }

                if (styleStr) {
                    $el.attr('style', styleStr);
                } else {
                    $el.removeAttr('style');
                }
            }
        };

        return dom;
    }
]);