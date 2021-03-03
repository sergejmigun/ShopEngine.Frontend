app.registerComponent('chatViewUiContext', 'Services.chatView', [
    '$',
    'Promise',
    'UI',
    'Utils.objects',
    'Utils.dates',
    'Collections',
    'Services.eventsInitializer',
    'Services.containerHelper',
    'UI.buttons',
    'UI.dropDownMenu',
    'UI.fixedArea',
    'UI.scrollView',
    'UI.multiLineTextBox',
    function ($, promise, ui, objects, dates, collections, eventsInitializer, containerHelper, buttons, dropDownMenu, fixedArea, scrollView, multiLineTextBox) {
        'use strict';
        return {
            init: function (container, initData) {
                var context = {}, _$wrapper = $('<div class="chat-view" />'), _$messagesWrapper, _$boxWrapper, _$initialPageWrapper, _fixedArea, _scrollView, _messageBox, _submitButton, _events = eventsInitializer.init(context, ['onContentChanged', 'onMessageSubmit', 'onPageCleared']);
                function scrollTo($el) {
                    $(window)['scrollTo']($el, 500, {
                        easing: 'swing',
                        offset: -300
                    });
                }
                function appendDaySplit($container, date) {
                    var dateText = dates.formatDate(date);
                    $container.before($('<p class="chat-day-split" />').append($("<span />").text(dateText)));
                    // remove repetitive day splits
                    _$messagesWrapper.find('.chat-day-split').each(function () {
                        var $split = $(this);
                        if ($.trim($split.text()) === dateText) {
                            $split.remove();
                        }
                    });
                }
                function initMessageActions($messageWrapper, actions, menuPosition) {
                    var $actionsMenuBtn = $('<span class="message-action-menu" />');
                    $messageWrapper.append($actionsMenuBtn);
                    dropDownMenu.init(containerHelper.appendTo($actionsMenuBtn, container.ready()), {
                        customDropDownToggleButtonHtml: '<i class="fa fa-bars" />',
                        items: actions,
                        position: menuPosition
                    });
                }
                function displayAuthorBar(message) {
                    if (message.author.ava) {
                        message['container'].prepend($('<img class="chat-message-author-ava" />').attr('src', message.author.ava));
                    }
                    var $authorWrapper = $('<div class="chat-message-author authorBlock" />');
                    if (message.author.customContent) {
                        ui.renderItem($authorWrapper, promise.empty(), message.author.customContent);
                    }
                    else {
                        $authorWrapper.text(message.author.name);
                    }
                    message['container'].prepend($authorWrapper);
                }
                function initMessageContent(message, displayAuthor, menuPosition) {
                    var $messageWrapper = $('<div class="chat-message" />'), $messageInfo = $('<span class="message-info" />');
                    message['container'] = $messageWrapper;
                    if (displayAuthor) {
                        displayAuthorBar(message);
                    }
                    if (message.isRemoved) {
                        $messageWrapper.append($('<span class="message-text removed-message" />')
                            .html('<i class="fa fa-trash-o"></i> ' + (initData.removedMessageText || 'Message was removed')));
                    }
                    else {
                        var $messageText = $('<span class="message-text" />');
                        $messageWrapper.append($messageText);
                        message['setText'] = function (text) {
                            $messageText.text(text);
                        };
                        message['setText'](message.text);
                    }
                    $messageWrapper.append($messageInfo);
                    if (initData.showMessageStatus) {
                        $messageInfo.append($('<span class="message-status" />').html(message['status'] + '<i class="fa fa-circle"></i>'));
                    }
                    $messageInfo.append($('<span class="message-date" />').text(initData.splitByDays
                        ? dates.formatTime(message.date)
                        : dates.format(message.date)));
                    $messageWrapper.append('<div class="clear messageAnchor" />');
                    if (message.actions) {
                        initMessageActions($messageWrapper, message.actions, menuPosition);
                    }
                }
                function initMessage(message, prevMessage, nextMessage) {
                    var alignmentClass = '', isRightPlacement = false;
                    if (message.isOwn) {
                        if (initData.ownMessageAlignment === 'right') {
                            isRightPlacement = true;
                            alignmentClass = 'right-alignment-messages-block';
                        }
                        else {
                            alignmentClass = 'left-alignment-messages-block';
                        }
                    }
                    else {
                        if (initData.ownMessageAlignment === 'right') {
                            alignmentClass = 'left-alignment-messages-block';
                        }
                        else {
                            isRightPlacement = true;
                            alignmentClass = 'right-alignment-messages-block';
                        }
                    }
                    var lastMessageDate = prevMessage ? prevMessage.date : null, lastAuthorId = prevMessage ? prevMessage.author.id : null, daySplit = initData.splitByDays && !(dates.areSameDates(lastMessageDate, message.date)), menuPosition = isRightPlacement ? UI.DropDownMenuPostion.right : UI.DropDownMenuPostion.left;
                    initMessageContent(message, lastAuthorId !== message.author.id, menuPosition);
                    message['container'].addClass(alignmentClass);
                    if (nextMessage && nextMessage.author.id === message.author.id) {
                        if (nextMessage.container) {
                            nextMessage.container.find('.authorBlock').remove();
                        }
                    }
                    else {
                        message['container'].addClass('margin-b-30');
                    }
                    if (prevMessage && prevMessage.author.id === message.author.id) {
                        prevMessage['container'].removeClass('margin-b-30');
                    }
                    return {
                        $messageWrapper: message['container'],
                        daySplit: daySplit
                    };
                }
                function initMessages(messages) {
                    var $pageWrapper = $('<div class="chat-page" />');
                    if (objects.isEmptyArray(messages)) {
                        $pageWrapper.append('<div class="chat-no-messages">No messages</div>');
                    }
                    else {
                        collections.foreach(messages, function (message, i) {
                            var initMessageResult = initMessage(message, messages[i - 1], messages[i + 1]);
                            $pageWrapper.append(initMessageResult.$messageWrapper);
                            if (initMessageResult.daySplit) {
                                appendDaySplit(initMessageResult.$messageWrapper, message.date);
                            }
                        });
                    }
                    var $last = $('<div />');
                    $pageWrapper.append($last);
                    return $pageWrapper;
                }
                function initInfiniteScroll() {
                    return scrollView.init(containerHelper.provide(_$messagesWrapper), {
                        direction: UI.ScrollViewDirection.LatestOnBottom,
                        currentPage: 4,
                        loadPage: function (token, loadOlderData) {
                            return initData.getMessages(token, loadOlderData).then(function (data) {
                                data.content = initMessages(data.messages);
                                _$initialPageWrapper = data.content;
                                return data;
                            });
                        },
                        containerReady: container.ready()
                    }).then(function (scrollView) {
                        _scrollView = scrollView;
                        fixedArea.init(_$boxWrapper, {
                            bottom: true
                        }).then(function (fixedArea) {
                            _fixedArea = fixedArea;
                        });
                        scrollView.onContentChanged(function () {
                            context.updateMessageBoxPosition();
                        });
                        scrollView.onPageCleared(function (page) {
                            _events.onPageCleared.invoke(page);
                        });
                        return scrollView;
                    });
                }
                function initInputBox() {
                    if (!initData.canReply) {
                        return promise.empty();
                    }
                    _$boxWrapper = $('<div class="chat-box" />');
                    var $input = $('<input type="hidden" />'), $buttonsWrapper = $('<div class="button-wrapper" />');
                    _$boxWrapper.append($('<div class="box-wrapper" />').append($input)).append($buttonsWrapper);
                    _$wrapper.append(_$boxWrapper);
                    var inputBarTemplatePromise = promise.empty();
                    if (initData.inputBarCustomContent) {
                        var $inputBarTemplateWrapper = $('<div />');
                        _$boxWrapper.prepend($inputBarTemplateWrapper);
                        inputBarTemplatePromise = ui.renderItem($inputBarTemplateWrapper, container.ready(), initData.inputBarCustomContent);
                    }
                    var messageBoxPromise = multiLineTextBox.init(containerHelper.replace($input, container.ready()), {
                        placeholder: 'Put your reply here',
                        rows: 3,
                        autosize: true,
                        disabled: initData.inputBarDisabled
                    });
                    _submitButton = buttons.roundIcon('fa fa-share', {
                        action: function () {
                            _events.onMessageSubmit.invoke();
                        },
                        css: 'pull-right color-blue',
                        disabled: initData.inputBarDisabled
                    }, containerHelper.appendTo($buttonsWrapper, container.ready()));
                    $buttonsWrapper.append('<div class="clear" />');
                    return promise.all([inputBarTemplatePromise, messageBoxPromise]).then(function (results) {
                        _messageBox = results[1];
                    });
                }
                function initTitle() {
                    if (initData.title) {
                        _$wrapper.prepend($('<div class="chat-title" />')
                            .append($('<h4 />').text(initData.title)));
                    }
                }
                function init(success) {
                    container.setContent(_$wrapper);
                    _$messagesWrapper = $('<div class="chat-messages" />');
                    _$wrapper.append(_$messagesWrapper);
                    initTitle();
                    var inputBoxPromise = initInputBox(), scrollViewPromise = initInfiniteScroll();
                    return promise.all([inputBoxPromise, scrollViewPromise]).then(function () {
                        success(context);
                    });
                }
                context.scrollTo = function (message) {
                    scrollTo(message.container.find('.messageAnchor'));
                };
                context.addMessage = function (newMessage, prevMessage, nextMessage) {
                    var initMessageResult = initMessage(newMessage, prevMessage, nextMessage);
                    if (prevMessage) {
                        prevMessage.container.after(initMessageResult.$messageWrapper);
                    }
                    else if (nextMessage) {
                        nextMessage.container.before(initMessageResult.$messageWrapper);
                    }
                    else {
                        _$initialPageWrapper.append(initMessageResult.$messageWrapper);
                    }
                    if (initMessageResult.daySplit) {
                        appendDaySplit(initMessageResult.$messageWrapper, newMessage.date);
                    }
                    context.updateMessageBoxPosition();
                };
                context.removeMessage = function (removedMessage, prevMessage, nextMessage) {
                    removedMessage.container.remove();
                    if (nextMessage && nextMessage.author.id === removedMessage.author.id) {
                        if (!prevMessage || prevMessage.author.id !== removedMessage.author.id) {
                            displayAuthorBar(nextMessage);
                        }
                    }
                    context.updateMessageBoxPosition();
                };
                context.updateMessageBoxPosition = function () {
                    _fixedArea.unfixArea();
                    _fixedArea.fixArea();
                };
                context.refresh = function () {
                    return _scrollView.refresh();
                };
                context.getMessage = function () {
                    return _messageBox.value();
                };
                context.setData = function (data) {
                    _messageBox.value(data.message);
                };
                context.setInputValue = function (value) {
                    _messageBox.value(value);
                };
                context.setInputState = function (disabled) {
                    _messageBox.disabled(disabled);
                    if (disabled) {
                        _submitButton.disable();
                    }
                    else {
                        _submitButton.enable();
                    }
                };
                return promise.create(init);
            }
        };
    }
]);
