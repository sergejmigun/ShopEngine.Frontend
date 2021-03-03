/*global tinyMCE*/
app.registerComponent('discussionViewHtmlEditor', 'Lib.ui', [
    '$',
    'Promise',
    'Collections',
    'Services',
    'Utils.objects',
    'Shared',
    function ($, promise, collections, services, objects, shared) {
        'use strict';
        return {
            init: function ($inputWrapper, commentData, _initData) {
                var control = {
                    getAttachments: function () {
                        return commentData.attachments;
                    }
                };
                var inputObjEvents = services.eventsInitializer.init(control, ['submit', 'cancel', 'change']);
                function initTinyMce(success) {
                    var textAreaId = objects.getGuid(), $textArea = $('<textarea />').attr('id', textAreaId);
                    function initPlaceholder(editor) {
                        if (!_initData.showInputPlaceholder) {
                            return;
                        }
                        var $placeholder = $('<span class="discussion-placeholder" />').hide(), placeholder = _initData.inputPlaceholder || 'Leave a comment';
                        function togglePlaceholder() {
                            if (editor.getContent()) {
                                $placeholder.hide();
                            }
                            else {
                                $placeholder.show();
                            }
                        }
                        $placeholder.text(placeholder);
                        $inputWrapper.append($placeholder);
                        editor.on('focus', function () {
                            $placeholder.hide();
                        });
                        editor.on('blur', togglePlaceholder);
                        togglePlaceholder();
                    }
                    $textArea.val(commentData.content);
                    $inputWrapper.append($textArea);
                    tinyMCE.init({
                        theme: "modern",
                        mode: 'exact',
                        plugins: ['autolink autoresize lists'],
                        toolbar1: 'blockquote | bold italic strikethrough | bullist',
                        image_advtab: true,
                        templates: [],
                        theme_advanced_toolbar_location: "top",
                        theme_advanced_toolbar_align: "left",
                        theme_advanced_statusbar_location: "bottom",
                        theme_advanced_resizing: true,
                        width: '100%',
                        elements: textAreaId,
                        body_class: 'discussion-view-wrapper',
                        content_css: '/content/styles/controls/discussionview.css,/content/styles/controls/emotionsPicker.css',
                        menubar: false,
                        statusbar: false,
                        force_p_newlines: false,
                        force_br_newlines: true,
                        convert_newlines_to_brs: false,
                        remove_linebreaks: true,
                        forced_root_block: false,
                        autoresize_bottom_margin: 0,
                        autoresize_max_height: 300,
                        autoresize_min_height: 100,
                        oninit: function () {
                            var editor = tinyMCE.get(textAreaId);
                            control.getContent = function () {
                                return editor.getContent();
                            };
                            control.getContentLength = function () {
                                return $('<div />').html(editor.getContent()).text().length;
                            };
                            control.destroy = function () {
                                editor.destroy();
                            };
                            control.clear = function () {
                                editor.setContent('');
                            };
                            control.append = function (content) {
                                editor.execCommand('mceInsertContent', false, content);
                            };
                            initPlaceholder(editor);
                            success(control);
                        },
                        setup: function (editor) {
                            var allowedKeys = [8, 13, 16, 17, 18, 20, 33, 34, 35, 36, 37, 38, 39, 40, 46];
                            function invokeChange() {
                                inputObjEvents.onChange.invoke();
                            }
                            function getSelectedTextlength() {
                                var selectedText = editor.selection.getContent({
                                    format: 'text'
                                });
                                return selectedText.length;
                            }
                            editor.on('paste', function (ev) {
                                if (!_initData.commentMaxLength) {
                                    return;
                                }
                                var originalEvent = ev.originalEvent || ev, clipboardData = originalEvent.clipboardData || shared.window.clipboardData, pastedContent = clipboardData.getData('Text');
                                if (_initData.commentMaxLength <= control.getContentLength() + pastedContent.length) {
                                    ev.stopPropagation();
                                    ev.preventDefault();
                                    return false;
                                }
                            });
                            editor.on('keyDown', function (ev) {
                                if (!_initData.commentMaxLength || collections.contains(allowedKeys, ev.keyCode)) {
                                    return;
                                }
                                if (_initData.commentMaxLength <= control.getContentLength() - getSelectedTextlength()) {
                                    ev.stopPropagation();
                                    ev.preventDefault();
                                    return false;
                                }
                            });
                            editor.on('keyUp', function () {
                                invokeChange();
                            });
                        }
                    });
                }
                return promise.create(function (success) {
                    initTinyMce(success);
                });
            }
        };
    }
]);
