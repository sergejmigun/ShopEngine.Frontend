app.registerComponent('discussionViewTextEditor', 'Lib.ui', [
    '$',
    'Promise',
    'Collections',
    'Utils.strings',
    'Utils.dom',
    'Services',
    'UI',
    function ($, promise, collections, strings, dom, services, ui) {
        'use strict';

        return {
            init: function ($inputWrapper, commentData, _initData) {
                var control = {
                    getAttachments: function () {
                        return commentData.attachments;
                    }
                };

                var inputObjEvents = services.eventsInitializer.init(control, ['submit', 'change']);

                function init(success) {
                    var $textArea = $('<textarea class="discussion-simple-editor" rows="5" />'),
                        currentValue = commentData.content;

                    $textArea.attr('placeholder', _initData.inputPlaceholder || 'Leave a comment');

                    if (_initData.commentMode === 'text' && _initData.commentMaxLength) {
                        $textArea.attr('max-length', _initData.commentMaxLength);
                    }

                    $inputWrapper.append($textArea);

                    function getCommentHtml(pseudoHtml) {
                        if (!pseudoHtml) {
                            return;
                        }

                        pseudoHtml = dom.htmlEncode(pseudoHtml);

                        var tagsFromatters = [{
                            startTag: '[',
                            endTag: ']',
                            format: function (body) {
                                var allowedTags = ['b', 'i', 's', '/b', '/i', '/s'];

                                if (collections.contains(allowedTags, body)) {
                                    return strings.format('<{0}>', body);
                                }
                            }
                        }, {
                            startTag: ':',
                            endTag: ':',
                            format: function (body) {
                                return ui.emotionsPicker.getEmotionHtml(body, 20);
                            }
                        }, {
                            startTag: '[img]',
                            endTag: '[/img]',
                            format: function (body) {
                                return strings.format('<img src="{0}" />', body);
                            }
                        }];

                        function addWrappedFormatter(baseFormatter, wrapStr) {
                            var f1 = {
                                startTag: wrapStr + baseFormatter.startTag,
                                endTag: baseFormatter.endTag,
                                format: baseFormatter.format
                            };

                            var f2 = {
                                startTag: baseFormatter.startTag,
                                endTag: baseFormatter.endTag + wrapStr,
                                format: baseFormatter.format
                            };

                            var f3 = {
                                startTag: wrapStr + baseFormatter.startTag,
                                endTag: baseFormatter.endTag + wrapStr,
                                format: baseFormatter.format
                            };

                            tagsFromatters.push(f1);
                            tagsFromatters.push(f2);
                            tagsFromatters.push(f3);
                        }

                        var quoteFormatter = {
                            startTag: '[quote]',
                            endTag: '[/quote]',
                            format: function (body) {
                                return strings.format('<blockquote>{0}</blockquote>', body);
                            }
                        };

                        tagsFromatters.push(quoteFormatter);
                        addWrappedFormatter(quoteFormatter, '\n');

                        var html = strings.formatTags(pseudoHtml, tagsFromatters);

                        html = html.replace(/\n/g, "<br />");
                        return html;
                    }

                    function getCommentPseudoHtml(html) {
                        if (!html) {
                            return '';
                        }

                        var $html = $('<div />').html(html);

                        $html.find('br').each(function () {
                            var $br = $(this);
                            $br.replaceWith('\n');
                        });

                        $html.find('img.emotion-item').each(function () {
                            var $img = $(this);
                            $img.replaceWith(strings.format(':{0}:', $img.attr('alt')));
                        });

                        $html.find('img').not('.emotion-item').each(function () {
                            var $img = $(this);
                            $img.replaceWith(strings.format('[img]{0}[/img]', $img.attr('src')));
                        });

                        html = strings.formatTags($html.html(), [{
                            startTag: '<',
                            endTag: '>',
                            format: function (body) {
                                var allowedTags = ['b', 'i', 's', '/b', '/i', '/s'];

                                if (collections.contains(allowedTags, body)) {
                                    return strings.format('[{0}]', body);
                                }
                            }
                        }, {
                            startTag: '<blockquote>',
                            endTag: '</blockquote>',
                            format: function (body) {
                                return strings.format('\n[quote]{0}[/quote]\n', body);
                            }
                        }]);

                        html = strings.trim(dom.htmlDecode(html));

                        return html;
                    }

                    $textArea.val(getCommentPseudoHtml(commentData.content)).autosize();

                    function checkCommentMaxLength() {
                        if (!_initData.commentMaxLength) {
                            return;
                        }

                        var value = $textArea.val(),
                            contentLength = value.length;

                        if (_initData.commentMaxLength < contentLength) {
                            $textArea.val(currentValue);
                        } else {
                            currentValue = value;
                            inputObjEvents.onChange.invoke();
                        }
                    }

                    control.getContent = function () {
                        return getCommentHtml($textArea.val());
                    };

                    control.destroy = function () {
                        return;
                    };

                    control.getContentLength = function () {
                        return $textArea.val().length;
                    };

                    control.clear = function () {
                        $textArea.val('');
                        inputObjEvents.onChange.invoke();
                    };

                    control.append = function (html) {
                        var appendContent = getCommentPseudoHtml(html);
                        ui.insertAtCursor($textArea[0], appendContent);
                    };

                    $textArea.keyup(function () {
                        checkCommentMaxLength();
                    });

                    $textArea.change(function () {
                        checkCommentMaxLength();
                    });

                    success(control);
                }

                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);