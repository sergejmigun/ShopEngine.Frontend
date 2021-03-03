app.registerComponent('discussionViewUiContext', 'Services.discussionView', [
    '$',
    'Promise',
    'Collections',
    'Shared',
    'Lib',
    'Services.eventsInitializer',
    'Services.containerHelper',
    'Utils.string',
    'Utils.dom',
    'Utils.dates',
    'UI.popover',
    'UI.emotionsPicker',
    'UI.textBox',
    'UI.carousel',
    'UI.fileUploader',
    'UI.modals',
    function (
        $: JQueryStatic,
        promise: IPromise,
        collections: ICollections,
        shared,
        lib,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        containerHelper: Services.IContainerHelper,
        strings: Utils.IStrings,
        dom: Utils.IDom,
        dates: Utils.IDates,
        popover: UI.IPopoverFactory,
        emotionsPicker: UI.IEmotionsPickerFactory,
        textBox: UI.ITextBoxFactory,
        carousel: UI.ICarouselFactory,
        fileUploader: UI.IFileUploaderFactory,
        modals: UI.IModalsFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var context = {} as Services.DiscussionView.IDiscussionViewUiContext,
                    _$wrapper = $('<div class="discussion-view-wrapper" />'),
                    _$commentsWrapper = $('<div class="discussion-comments-wrapper" />'),
                    _defaultAvatarImageSrc = '//a.disquscdn.com/1455048077/images/noavatar92.png',
                    _currentTextSelectionComment,
                    _replies: Services.DiscussionView.IReply[],
                    _localization = {
                        reply: initData.replyText || 'Reply',
                        edit: initData.editText || 'Edit',
                        del: initData.deleteText || 'Delete',
                        cancel: initData.cancelText || 'Cancel',
                        deletedCommentText: initData.deletedCommentText || 'This comment was removed.'
                    };

                function startTrackTextSelection(comment) {
                    if (_currentTextSelectionComment) {
                        _currentTextSelectionComment.selectedContent = null;
                    }

                    _currentTextSelectionComment = comment;
                }

                function endTrackTextSelection(comment) {
                    if (!_currentTextSelectionComment) {
                        return;
                    }

                    if (_currentTextSelectionComment === comment) {
                        comment.selectedContent = dom.getSelectionText().replace(/\n/g, "<br />");
                    } else {
                        _currentTextSelectionComment.selectedContent = null;
                    }
                }

                function showComment(comment, highLight, scroll) {
                    if (highLight) {
                        comment.mainAreaWrapper.effect("highlight", {
                            color: '#f5f9ff'
                        }, 1000);
                    }

                    if (scroll) {
                        window['$'].scrollTo(comment.mainAreaWrapper, 500, {
                            easing: 'swing',
                            margin: true,
                            offset: -200
                        });
                    }
                }

                function initAvatar(url, $avatarContainer) {
                    if (initData.noAvatars) {
                        return;
                    }

                    function initImage() {
                        function getDefaultImage() {
                            return $('<img />').attr('src', _defaultAvatarImageSrc);
                        }

                        return promise.create(function (success) {
                            if (!url) {
                                success(getDefaultImage());
                            }

                            var $image;

                            $image = $('<img />', {
                                src: url,
                                error: function () {
                                    success(getDefaultImage());
                                },
                                load: function () {
                                    success($image);
                                }
                            });
                        });
                    }

                    var $avaWrapper = $('<div class="discussion-ava" />');
                    $avatarContainer.append($avaWrapper);

                    initImage().then(function ($img: JQuery) {
                        $avaWrapper.append($img);
                    });
                }

                function initInputBox($container, commentData, needCancel) {
                    var $formWrapper = $('<form />'),
                        $inputWrapper = $('<div class="discussion-input-wrapper" />'),
                        $errorWrapper = $('<div class="discussion-form-error-wrapper" />').hide(),
                        $actionsWrapper = $('<div class="discussion-form-actions-wrapper" />'),
                        inputBox = {} as any,
                        inputBoxEvents = eventsInitializer.init(inputBox, ['submit', 'cancel']),
                        validationTimeOuts = [];

                    function getContentLength(targetContent) {
                        return $('<div />').html(targetContent).text().length;
                    }

                    function initActions(editor) {
                        var $left = $('<div class="pull-left" />'),
                            $right = $('<div class="pull-right" />');

                        function initSubmit() {
                            var $submitButton = $('<button class="discussion-button pull-right" />');
                            $right.append($submitButton.text('Submit'));
                        }

                        function initCancel() {
                            if (!needCancel) {
                                return;
                            }

                            var $cancelButton = $('<button class="discussion-button pull-right margin-r-10" />');
                            $right.append($cancelButton);

                            $cancelButton.text(_localization.cancel).click(function () {
                                inputBox.destroy();
                                inputBoxEvents.cancel.invoke();
                                return false;
                            });
                        }

                        function initCommentMaxLengthLimitation() {
                            if (!initData.commentMaxLength) {
                                return;
                            }

                            var $commentLenghthWrapper = $('<span class="comment-lenght-wrapper pull-right" />');
                            $right.append($commentLenghthWrapper);

                            function setCommentMaxLengthText(currentlength) {
                                $commentLenghthWrapper.text(strings.format('{0} / {1}', currentlength, initData.commentMaxLength));
                            }

                            setCommentMaxLengthText(getContentLength(commentData.content));

                            editor.onChange(function () {
                                setCommentMaxLengthText(editor.getContentLength());
                            });
                        }

                        function initEmotions() {
                            var $smile = $(emotionsPicker.getEmotionHtml('smile', 20)),
                                $emotionsContainer = $('<div />');

                            emotionsPicker.init(containerHelper.appendTo($emotionsContainer, container.ready()), {
                                size: 20
                            }).then(function (emotionsPicker) {
                                popover.init(containerHelper.appendTo($smile, container.ready()), {
                                    trigger: 'manual',
                                    content: $emotionsContainer,
                                    placement: UI.PopoverPlacement.Right,
                                    hideOnBodyClick: true,
                                    hideOnContentClick: true
                                }).then(function (popover) {
                                    $smile.click(function () {
                                        popover.show();
                                        return false;
                                    });

                                    $formWrapper.find('iframe').contents().click(function () {
                                        popover.hide();
                                    });
                                });

                                emotionsPicker.pick(function (emotion) {
                                    editor.append(emotion.html);
                                });

                                $smile.attr('title', 'Add emotions');
                            });

                            $left.append($smile);
                        }

                        function initImageUploadings() {
                            var $imageLoad = $('<div class="discussion-image-load" />'),
                                $imageFormContainer = $('<div class="discussion-image-box" />'),
                                $imageFormUrl = $('<div><span>Enter an image url:</span><br />' +
                                    '<div class="discussion-image-url-wrapper"><input type="hidden" /></div></div>'
                                ),
                                $imageFormButton = $('<button class="discussion-button">Post</button>'),
                                $imageFormUpload = $('<div><br><input type="hidden" /></div>'),
                                $icon = $('<i class="glyphicon glyphicon-picture" />').attr('title', 'Load image'),
                                $uploadImageCustomButton = $('<a><i class="glyphicon glyphicon-open" /> Upload image</a>');

                            $imageLoad.append($icon);
                            $left.append($imageLoad);
                            $imageFormUrl.append($imageFormButton);
                            $imageFormContainer.append($imageFormUrl);
                            $imageFormContainer.append($imageFormUpload);

                            var tbInit = textBox.init(containerHelper.replace($imageFormUrl.find('input'), container.ready()), {}),
                                uplInit = fileUploader.init(containerHelper.replace($imageFormUpload.find('input'), container.ready()), {
                                    customButton: $uploadImageCustomButton,
                                    showProgressBar: false,
                                    showUploadedFiles: false,
                                    uploadUrl: '/Help/Upload'
                                });

                            promise.all<any>([tbInit, uplInit]).then(function (instances) {
                                var textBox = instances[0] as UI.ITextBox,
                                    uploader = instances[1] as UI.IFileUploader;

                                popover.init(containerHelper.appendTo($imageLoad, container.ready()), {
                                    trigger: 'manual',
                                    title: '',
                                    content: $imageFormContainer,
                                    placement: UI.PopoverPlacement.Right,
                                    hideOnBodyClick: true
                                }).then(function (popover) {
                                    $imageLoad.click(function () {
                                        popover.show();
                                        return false;
                                    });

                                    $formWrapper.find('iframe').contents().click(function () {
                                        popover.hide();
                                    });

                                    $uploadImageCustomButton.click(function () {
                                        popover.hide();
                                    });

                                    $imageFormButton.click(function () {
                                        if (textBox.value()) {
                                            var imgHtml = strings.format('<img src="{0}" />', textBox.value());
                                            editor.append(imgHtml);
                                            textBox.value('');
                                        }

                                        popover.hide();
                                    });
                                });

                                uploader.onDone(function (data) {
                                    var imgHtml = strings.format('<img src="/Help/Download?filename={0}" />', data.files[0].name);
                                    editor.append(imgHtml);
                                });
                            });
                        }

                        function initAttachmentUploadings() {
                            var $attachLoad = $('<div class="discussion-attachment-load" />').attr('title', 'Load attachments'),
                                $loadedAttachments = $('<div class="discussion-loaded-attachments" />'),
                                $loadedAttachmentsInner = $('<div />'),
                                $hidden = $('<input type="hidden" />'),
                                $icon = $('<i class="glyphicon glyphicon-paperclip" />');

                            $attachLoad.append($hidden);
                            $left.append($attachLoad);
                            $loadedAttachments.append($loadedAttachmentsInner);
                            $loadedAttachments.append('<div class="clear" />');
                            $loadedAttachments.insertAfter($left).css('width', $actionsWrapper.width() - ($left.width() + $right.width()) - 30);

                            carousel.init(containerHelper.appendTo($loadedAttachmentsInner, container.ready()), {
                                infinite: false,
                                items: [],
                                dots: true,
                                variableWidth: true,
                                arrows: false,
                                slides: 5
                            }).then(function (carousel) {
                                function addCarouselItem(attachment) {
                                    var $itemWrapper = $('<span class="discussion-loaded-attachment-item" />'),
                                        $link = $('<a />').text(attachment.title).attr('href', attachment.url),
                                        $remove = $('<i class="glyphicon glyphicon-remove-circle" />'),
                                        carouselItem = {
                                            content: $itemWrapper,
                                            contentReady: promise.empty()
                                        };

                                    $itemWrapper.append($link).append($remove);
                                    carousel.addItem(carouselItem);

                                    $remove.click(function () {
                                        var index = collections.indexOf(commentData.attachments, attachment);

                                        carousel.removeItem(index);
                                        collections.removeByIndex(commentData.attachments, index);
                                    });
                                }

                                var clearContent = editor.clear;
                                editor.clear = function () {
                                    if (commentData.attachments) {
                                        carousel.clearItems();
                                        collections.removeAll(commentData.attachments);
                                    }

                                    clearContent();
                                };

                                if (commentData.attachments) {
                                    collections.foreach(commentData.attachments, function (attachment) {
                                        addCarouselItem(attachment);
                                    });
                                }

                                fileUploader.init(containerHelper.replace($hidden, container.ready()), {
                                    customButton: $icon,
                                    showProgressBar: false,
                                    showUploadedFiles: false,
                                    uploadUrl: '/Help/Upload'
                                }).then(function (uploader) {
                                    uploader.onDone(function (data) {
                                        var fileName = data.files[0].name,
                                            attachment = {
                                                title: fileName,
                                                url: strings.format('/Help/Download?filename={0}', fileName)
                                            };

                                        if (!commentData.attachments) {
                                            commentData.attachments = [];
                                        }

                                        commentData.attachments.push(attachment);
                                        addCarouselItem(attachment);
                                    });
                                });
                            });
                        }

                        $actionsWrapper.append($left).append($right).append('<div class="clear" />');

                        initSubmit();
                        initCancel();
                        initCommentMaxLengthLimitation();
                        initEmotions();
                        initImageUploadings();
                        initAttachmentUploadings();
                    }

                    function displayError(message) {
                        collections.foreach(validationTimeOuts, function (timeOut) {
                            shared.window.clearTimeout(timeOut);
                        });

                        $errorWrapper.stop(true, true).text(message).fadeIn(500, function () {
                            validationTimeOuts.push(shared.window.setTimeout(function () {
                                $errorWrapper.stop(true, true).slideToggle();
                            }, 2000));
                        });
                    }

                    $container.append($formWrapper);
                    $formWrapper.append($inputWrapper);
                    $formWrapper.append($errorWrapper);
                    $formWrapper.append($actionsWrapper);

                    return promise.create<UI.IDiscussionViewInputBox>(function (success) {
                        function editorRready(editor) {
                            inputBox.editor = editor;

                            initActions(editor);

                            $formWrapper.submit(function () {
                                if (!editor.getContent()) {
                                    return false;
                                }

                                try {
                                    inputBoxEvents.submit.invoke();
                                } catch (err) {
                                    displayError(err);
                                }

                                return false;
                            });

                            inputBox.destroy = function () {
                                editor.destroy();
                                $formWrapper.remove();
                            };

                            success(inputBox);
                        }

                        if (initData.editor === 'html') {
                            lib.ui.discussionViewHtmlEditor.init($inputWrapper, commentData, initData).then(function (editor) {
                                editorRready(editor);
                            });
                        } else {
                            lib.ui.discussionViewTextEditor.init($inputWrapper, commentData, initData).then(function (editor) {
                                editorRready(editor);
                            });
                        }
                    });
                }

                function initInputBoxWithAvatar($container, commentData, needCancel) {
                    var $inputWrapper = $('<div class="discussion-box-container" />');

                    $container.append($inputWrapper);
                    initAvatar(initData.currentUser.avatarUrl, $inputWrapper);

                    return initInputBox($inputWrapper, commentData, needCancel);
                }

                function appendBullet($container) {
                    var $bullet = $('<span class="discussion-bullet">.</span>');
                    $container.append($bullet);
                    return $bullet;
                }

                function setAttachments(reply: Services.DiscussionView.IReply) {
                    if (!reply.attachments || !reply.attachments.length) {
                        reply.attachmentsWrapper.html('');

                        return;
                    }

                    var $wrapper = $('<div class="discussion-attachments" />')
                        .append('<i class="glyphicon glyphicon-paperclip discussion-attachments-icon" />');

                    reply.attachmentsWrapper.append($wrapper);

                    collections.foreach(reply.attachments, function (attachment, i) {
                        if (i !== 0) {
                            appendBullet($wrapper);
                        }

                        var $attachmentLink = $('<a />').text(attachment.title).attr('href', attachment.url);
                        $wrapper.append($attachmentLink);
                    });
                }

                function initReply(reply: Services.DiscussionView.IReply) {
                    function initCommentActions() {
                        var $wrapper = $('<div class="discussion-actions" />'),
                            needBullet;

                        reply.mainAreaWrapper.append($wrapper);

                        function checkBullets() {
                            if (needBullet) {
                                needBullet = false;

                                return appendBullet($wrapper);
                            }
                        }

                        function initReplyAction() {
                            var $replyLink;

                            $replyLink = $('<a href="#" class="discussion-reply" />').text(_localization.reply).click(function () {
                                var $replyInputContainer = $('<div class="discussion-reply-input-wrapper" />'),
                                    replyContent = null;

                                reply.mainAreaWrapper.append($replyInputContainer);

                                if (reply.selectedContent) {
                                    replyContent = dom.getOuterHtml($('<blockquote />').html(reply.selectedContent)) + '<br />';
                                }

                                initInputBoxWithAvatar($replyInputContainer, {
                                    content: replyContent
                                }, true).then(function (inputBox) {
                                    inputBox.submit(function () {
                                        var inputData = {
                                            content: inputBox.editor.getContent(),
                                            attachments: inputBox.editor.getAttachments()
                                        };

                                        initData.submitReply(inputData).then(function (newReply) {
                                            initReply(newReply);
                                            showComment(newReply, true, !initData.addCommentsToStart || newReply.repliesLineMode);
                                            inputBox.destroy();
                                            $replyInputContainer.remove();
                                            $replyLink.show();
                                            $replyLink.next().show();
                                        });
                                    });

                                    inputBox.cancel(function () {
                                        inputBox.destroy();
                                        $replyInputContainer.remove();
                                        $replyLink.show();
                                        $replyLink.next().show();
                                    });
                                });

                                $replyLink.hide();
                                $replyLink.next().hide();

                                return false;
                            });

                            $wrapper.append($replyLink);
                            needBullet = true;
                        }

                        function initEditAction() {
                            if (!reply.canEdit) {
                                return;
                            }

                            var $bullet = checkBullets(),
                                $editLink = $('<a href="#" class="discussion-edit" />').text(_localization.edit);

                            function toggle$Elements(action: string) {
                                $editLink[action]();

                                if ($bullet) {
                                    $bullet[action]();
                                }
                            }

                            $editLink.click(function () {
                                reply.contentBodyWrapper.hide();
                                reply.attachmentsWrapper.hide();

                                var inputBoxData = {
                                    content: reply.content,
                                    attachments: collections.clone(reply.attachments)
                                };

                                initInputBox(reply.contentBodyWrapper.parent(), inputBoxData, true).then(function (inputBox) {
                                    inputBox.submit(function () {
                                        var content = inputBox.editor.getContent();

                                        reply.contentBodyWrapper.html(content).show();
                                        reply.attachmentsWrapper.show();
                                        reply.attachments = inputBox.editor.getAttachments();
                                        reply.attachmentsWrapper.html('');
                                        setAttachments(reply);
                                        reply.content = content;
                                        inputBox.destroy();
                                        toggle$Elements('show');
                                    });

                                    inputBox.cancel(function () {
                                        inputBox.destroy();
                                        toggle$Elements('show');
                                        reply.contentBodyWrapper.show();
                                        reply.attachmentsWrapper.show();
                                    });
                                });

                                toggle$Elements('hide');
                                return false;
                            });

                            $wrapper.append($editLink);
                            needBullet = true;
                        }

                        function initDeleteAction() {
                            if (!reply.canDelete) {
                                return;
                            }

                            var $deleteLink = $('<a href="#" class="discussion-delete" />').text(_localization.del);

                            checkBullets();

                            function markAsDeleted() {
                                var $removed = $('<span class="discussion-removed-comment" />').text(_localization.deletedCommentText);

                                reply.deleted = true;
                                reply.attachments = null;
                                $wrapper.remove();
                                reply.attachmentsWrapper.remove();
                                reply.contentBodyWrapper.html('');
                                reply.contentBodyWrapper.append($removed);
                            }

                            function deleteCompletely() {
                                function remove(reply) {
                                    var source = reply.parent ? reply.parent.replies : _replies;

                                    collections.remove(source, reply);

                                    if (reply.replies) {
                                        collections.foreach(reply.replies, function (innerReply) {
                                            remove(innerReply);
                                        });
                                    }

                                    reply.commentWrapper.remove();
                                }

                                remove(reply);
                            }

                            function deleteReply() {
                                if (initData.deletionType === 'markAsDeleted') {
                                    markAsDeleted();
                                } else if (initData.deletionType === 'deleteCompletely') {
                                    deleteCompletely();
                                }
                            }

                            $deleteLink.click(function () {
                                if (initData.deletionConfirmation) {
                                    modals.confirm({
                                        title: 'Confirm',
                                        message: initData.deletionConfirmationText || 'Are you sure you want to delete this comment?'
                                    }).then(function () {
                                        deleteReply();
                                    });
                                } else {
                                    deleteReply();
                                }

                                return false;
                            });

                            $wrapper.append($deleteLink);
                            needBullet = true;
                        }

                        function initLikeAction() {
                            function initLikes() {
                                var $likeToggle = $('<span class="discussion-like-toggle" />'),
                                    $likesCount = $('<span />'),
                                    $likeIcon = $('<i />');

                                function setLikeIconCss() {
                                    $likeIcon.attr('class', reply.liked
                                        ? 'glyphicon glyphicon-heart'
                                        : 'glyphicon glyphicon-heart-empty');
                                }

                                $wrapper.append($likeToggle);
                                setLikeIconCss();

                                $likeToggle.append($likeIcon).append($likesCount.text(reply.likesCount));
                                $likeToggle.click(function () {
                                    reply.liked = !reply.liked;
                                    reply.likesCount = reply.liked
                                        ? reply.likesCount + 1
                                        : reply.likesCount - 1;

                                    $likesCount.text(reply.likesCount);
                                    setLikeIconCss();
                                });
                            }

                            function initThumbs() {
                                var $thumbsUp = $('<span class="discussion-thumbs-toggle discussion-thumbs-up" />'),
                                    $thumbsDown = $('<span class="discussion-thumbs-toggle discussion-thumbs-down" />');

                                $thumbsUp.append('<i class="glyphicon glyphicon-thumbs-up" /> <span />');
                                $thumbsDown.append('<i class="glyphicon glyphicon-thumbs-down" /> <span />');

                                function setCounters() {
                                    $thumbsUp.find('span').text(reply.thumbsUpCount);
                                    $thumbsDown.find('span').text(reply.thumbsDownCount);
                                }

                                function setActive() {
                                    if (reply.thumbsUpped) {
                                        $thumbsUp.addClass('discussion-thumbs-active');
                                        $thumbsDown.removeClass('discussion-thumbs-active');
                                    } else if (reply.thumbsDowned) {
                                        $thumbsDown.addClass('discussion-thumbs-active');
                                        $thumbsUp.removeClass('discussion-thumbs-active');
                                    } else {
                                        $thumbsUp.removeClass('discussion-thumbs-active');
                                        $thumbsDown.removeClass('discussion-thumbs-active');
                                    }
                                }

                                if (!reply.thumbsUpCount) {
                                    reply.thumbsUpCount = 0;
                                }

                                if (!reply.thumbsDownCount) {
                                    reply.thumbsDownCount = 0;
                                }

                                setCounters();
                                setActive();

                                $thumbsUp.click(function () {
                                    if (reply.thumbsUpped) {
                                        reply.thumbsUpped = false;
                                        reply.thumbsUpCount -= 1;
                                    } else {
                                        if (reply.thumbsDowned) {
                                            reply.thumbsDowned = false;
                                            reply.thumbsDownCount -= 1;
                                        }

                                        reply.thumbsUpped = true;
                                        reply.thumbsUpCount += 1;
                                    }

                                    setCounters();
                                    setActive();
                                    return false;
                                });

                                $thumbsDown.click(function () {
                                    if (reply.thumbsDowned) {
                                        reply.thumbsDowned = false;
                                        reply.thumbsDownCount -= 1;
                                    } else {
                                        if (reply.thumbsUpped) {
                                            reply.thumbsUpped = false;
                                            reply.thumbsUpCount -= 1;
                                        }

                                        reply.thumbsDowned = true;
                                        reply.thumbsDownCount += 1;
                                    }

                                    setCounters();
                                    setActive();
                                    return false;
                                });

                                $wrapper.append($thumbsUp).append($thumbsDown);
                            }

                            if (initData.allowLikes) {
                                initLikes();
                            } else if (initData.allowThumbs) {
                                initThumbs();
                            }
                        }

                        function initToggleRepliesAction() {
                            var $toggleReplies = $('<i class="glyphicon discussion-replies-toggle" />').hide(),
                                $repliesCount = $('<span class="discussion-replies-count" />').hide();

                            function showReplies() {
                                $toggleReplies.addClass('glyphicon-minus').removeClass('glyphicon-plus');
                                $repliesCount.hide();
                                reply.repliesContainer.show();
                            }

                            function hideReplies() {
                                $toggleReplies.addClass('glyphicon-plus').removeClass('glyphicon-minus');
                                $repliesCount.text(strings.format('{0} replies', reply.replies.length)).show();
                                reply.repliesContainer.hide();
                            }

                            function toggleReplies() {
                                if (reply.collapseReplies) {
                                    hideReplies();
                                } else {
                                    showReplies();
                                }
                            }

                            $toggleReplies.click(function () {
                                reply.collapseReplies = !reply.collapseReplies;
                                toggleReplies();
                            });

                            toggleReplies();

                            $wrapper.append($toggleReplies);
                            $wrapper.append($repliesCount);

                            reply.toggleReplies = function (action) {
                                $toggleReplies[action]();

                                if (reply.collapseReplies && action === 'show') {
                                    $repliesCount[action]();
                                }
                            };

                            reply.showReplies = showReplies;
                        }

                        initReplyAction();
                        initEditAction();
                        initDeleteAction();
                        initLikeAction();
                        initToggleRepliesAction();
                    }

                    function initCommentInfo() {
                        var $wrapper = $('<div class="discussion-info" />'),
                            $autnorLink = $('<a href="#" class="discussion-person" />'),
                            $time = $('<span class="discussion-time" />');

                        function formatDate() {
                            if (initData.dateFormatter) {
                                $time.text(initData.dateFormatter(reply.date));
                                return;
                            }

                            var diff = Date.now() - reply.date.getTime(),
                                diffSeconds = Math.abs(diff / 1000),
                                text;

                            if (diffSeconds < 60) {
                                text = 'few seconds ago';
                            } else {
                                var diffHours = Math.abs(diffSeconds / 60);

                                if (diffHours > 5) {
                                    text = dates.formatDate(reply.date);
                                } else {
                                    text = diffHours + ' hours ago';
                                }
                            }

                            $time.text(text);
                        }

                        reply.mainAreaWrapper.append($wrapper);

                        $wrapper.append($autnorLink);
                        appendBullet($wrapper);
                        $wrapper.append($time);
                        formatDate();

                        $autnorLink.text(reply.author.name).attr('href', reply.author.link);

                        if (reply.parent) {
                            var $replyTo = $('<span class="discussion-replied-to" />').append('<i class="glyphicon glyphicon-share-alt"></i>'),
                                $replyToLink = $('<a href="#" class="discussion-person" />');

                            appendBullet($wrapper);
                            $wrapper.append($replyTo);
                            $replyTo.append($replyToLink);
                            $replyToLink.text(reply.parent.author.name).click(function () {
                                showComment(reply.parent, true, true);

                                return false;
                            });
                        }
                    }

                    function initCommentBody() {
                        reply.contentBodyWrapper = $('<div />');
                        reply.contentBodyWrapper.html(reply.content);
                        reply.mainAreaWrapper.append(reply.contentBodyWrapper.wrap('<div class="discussion-body" />').parent());

                        reply.contentBodyWrapper.mousedown(function () {
                            startTrackTextSelection(reply);
                        }).mouseup(function () {
                            endTrackTextSelection(reply);
                        });
                    }

                    function initCommentAttachments() {
                        if (!initData.allowAttachemnts) {
                            return;
                        }

                        reply.attachmentsWrapper = $('<div />');
                        reply.mainAreaWrapper.append(reply.attachmentsWrapper);
                        setAttachments(reply);
                    }

                    function initRepliesContainer() {
                        if (!initData.allowReplies) {
                            return;
                        }

                        var currentDepth = 1,
                            parent = reply.parent;

                        while (parent) {
                            parent = parent.parent;
                            currentDepth += 1;
                        }

                        if (initData.viewMode === 'tree' && (initData.maxTreeDepth && currentDepth < initData.maxTreeDepth)) {
                            reply.repliesContainer = $('<div class="discussion-replies" />');
                            reply.commentWrapper.append(reply.repliesContainer);
                        } else {
                            reply.repliesContainer = reply.container;
                            reply.repliesLineMode = true;
                        }
                    }

                    if (reply.parent) {
                        reply.container = reply.parent.repliesContainer;
                        reply.parent.toggleReplies('show');
                    } else {
                        reply.container = _$commentsWrapper;
                    }

                    reply.commentWrapper = $('<div class="discussion-view-item" />');
                    reply.mainAreaWrapper = $('<div class="discussion-main" />');

                    if (initData.addCommentsToStart) {
                        reply.container.prepend(reply.commentWrapper);
                    } else {
                        reply.container.append(reply.commentWrapper);
                    }

                    reply.commentWrapper.append(reply.mainAreaWrapper);

                    initAvatar(reply.author.avatarUrl, reply.commentWrapper);
                    initCommentInfo();
                    initCommentBody();
                    initCommentAttachments();
                    initRepliesContainer();
                    initCommentActions();
                }

                function init(success) {
                    container.setContent(_$wrapper);
                    _$wrapper.append(_$commentsWrapper);

                    success(context);
                }

                context.initMainInput = function () {
                    initInputBoxWithAvatar(_$wrapper, {}, false).then(function (inputBox: any) {
                        inputBox.submit(function () {
                            initData.submitReply({}).then(function (newReply) {
                                initReply(newReply);
                                showComment(newReply, true, !initData.addCommentsToStart);
                                inputBox.editor.clear();
                            });
                        });
                    });

                    _$wrapper.append('<br />');
                };

                context.displayReplies = function (replies) {
                    collections.foreach(replies, function (reply) {
                        initReply(reply);
                    });
                };

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as Services.DiscussionView.IDiscussionViewUiContextFactory;
    }
]);
