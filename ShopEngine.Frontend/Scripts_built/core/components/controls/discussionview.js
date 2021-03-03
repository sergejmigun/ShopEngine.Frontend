app.registerComponent('discussionView', 'UI', [
    'Promise',
    'Collections',
    'Services.discussionView.discussionViewUiContext',
    function (promise, collections, discussionViewUiContext) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _uiContext;
                function initView() {
                    function getRepliesContextData(replies, parent) {
                        var contextReplies = [];
                        collections.foreach(replies, function (reply) {
                            var conextReply = {};
                            conextReply.replies = getRepliesContextData(reply.replies, conextReply);
                            conextReply.parent = parent;
                            contextReplies.push(conextReply);
                        });
                        return contextReplies;
                    }
                    if (initData.allowReplies) {
                        _uiContext.initMainInput();
                    }
                    _uiContext.displayReplies(getRepliesContextData(initData.replies, null));
                }
                function init(success) {
                    var uiContextInitData = {
                        currentUser: initData.currentUser,
                        noAvatars: initData.noAvatars,
                        commentMaxLength: initData.commentMaxLength,
                        addCommentsToStart: initData.addCommentsToStart,
                        submitReply: function (data) {
                            return promise.create(function (success) {
                                var newComment = {
                                    content: data.content,
                                    attachments: data.attachments,
                                    author: initData.currentUser,
                                    canEdit: true,
                                    canDelete: true,
                                    liked: false,
                                    likesCount: 0,
                                    date: new Date(),
                                    hasReplies: false
                                };
                                success(newComment);
                            });
                        }
                    };
                    discussionViewUiContext.init(container, uiContextInitData).then(function (uiContext) {
                        _uiContext = uiContext;
                        initView();
                        success(control);
                    });
                }
                control.remove = function () {
                    return;
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);
