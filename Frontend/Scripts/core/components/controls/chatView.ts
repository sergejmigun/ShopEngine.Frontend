app.registerComponent('chatView', 'UI', [
    'Promise',
    'Utils.objects',
    'Collections',
    'Services.eventsInitializer',
    'Services.chatView.chatViewUiContext',
    function (promise: IPromise,
        objects: Utils.IObjects,
        collections: ICollections,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        chatViewUiContext: Services.ChatView.IChatViewUiContextFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var _uiContext: Services.ChatView.IChatViewUiContext,
                    _messages = [];

                var _events = {
                    onMessageSubmit: eventsInitializer.initEvent<string>()
                };

                var _control: UI.IChatView = {
                    setInputValue: function (value) {
                        _uiContext.setInputValue(value);
                    },
                    disableInput: function () {
                        _uiContext.setInputState(true);
                    },
                    enableInput: function () {
                        _uiContext.setInputState(false);
                    },
                    focusMessage: function (messageId) {
                        collections.foreach(_messages, function (message) {
                            if (message.id === messageId) {
                                _uiContext.scrollTo(message);

                                return false;
                            }
                        });
                    },
                    addMessage: function (messageData) {
                        var targetIndex = _messages.length + 1;
                        var prev = _messages[targetIndex - 1],
                            next = _messages[targetIndex + 1];

                        _messages.push();
                        collections.insert(_messages, targetIndex, messageData);
                        _uiContext.addMessage(messageData, prev, next);
                    },
                    updateMessage: function (messageId, messageText) {
                        var message = findMessage(messageId);

                        if (message) {
                            message.setText(messageText);
                            _uiContext.updateMessageBoxPosition();
                        }
                    },
                    removeMessage: function (messageId) {
                        var messageIndex = collections.indexOf(_messages, function (message) {
                            return message.id === messageId;
                        });

                        if (messageIndex !== -1) {
                            _uiContext.removeMessage(_messages[messageIndex], _messages[messageIndex - 1], _messages[messageIndex + 1]);
                            collections.remove(_messages, _messages[messageIndex]);
                        }
                    },
                    onMessageSubmit: _events.onMessageSubmit.event
                };

                function findMessage(messageId) {
                    return collections.from(_messages).first(function (message) {
                        return message.id === messageId;
                    });
                }

                function init(success) {
                    var uiContextInitData = {
                        getMessages: function (token, loadOlderData) {
                            return initData.getMessages(token, loadOlderData).then(function (data) {
                                var tokens = null;

                                if (data.messages && data.messages.length) {
                                    tokens = {
                                        first: collections.first(data.messages).id,
                                        last: collections.last(data.messages).id
                                    };

                                    collections.copy(data.messages, _messages);
                                }

                                return {
                                    messages: data.messages,
                                    hasMoreData: data.messages && data.hasMoreData,
                                    tokens: tokens
                                };
                            });
                        }
                    };

                    objects.map(initData, uiContextInitData, [
                        'removedMessageText',
                        'showMessageStatus',
                        'splitByDays',
                        'ownMessageAlignment',
                        'inputBarTemplate',
                        'canReply',
                        'title',
                        'inputBarDisabled',
                        'inputBarCustomContent'
                    ]);

                    chatViewUiContext.init(container, uiContextInitData as any).then(function (uiContext) {
                        _uiContext = uiContext;
                        uiContext.onMessageSubmit(function () {
                            _events.onMessageSubmit.invoke(_uiContext.getMessage());
                        });
                    });

                    success(_control);
                }

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as UI.IChatViewFactory;
    }
]);