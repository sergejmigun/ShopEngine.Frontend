app.registerComponent('discussionView', 'UI', [
    'Promise',
    'Collections',
    'Services.discussionView.discussionViewUiContext',
    function (promise: IPromise,
        collections: ICollections,
        discussionViewUiContext: Services.DiscussionView.IDiscussionViewUiContextFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IDiscussionView,
                    _uiContext: Services.DiscussionView.IDiscussionViewUiContext;

                function initView() {
                    function getRepliesContextData(replies: UI.IDiscussionViewReply[], parent: Services.DiscussionView.IReply) {
                        var contextReplies: Services.DiscussionView.IReply[] = [];

                        collections.foreach(replies, function (reply) {
                            var conextReply = {} as Services.DiscussionView.IReply;

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
                        submitReply: function (data: any) {
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
                    } as any;

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
        } as UI.IDiscussionViewFactory;
    }
]);