namespace Services.DiscussionView {
    export interface IReply {
        replies: IReply[];
        parent: IReply;
        container: JQuery;
        repliesContainer: JQuery;
        commentWrapper: JQuery;
        mainAreaWrapper: JQuery;
        contentBodyWrapper: JQuery;
        attachmentsWrapper: JQuery;
        content: string;
        author: UI.IDiscussionViewAuthor;
        canEdit: boolean;
        canDelete: boolean;
        collapseReplies: boolean;
        deleted: boolean;
        toggleReplies(arg: string): void;
        showReplies(): void;
        attachments: any[];
        selectedContent: string;
        likesCount: number;
        liked: boolean;
        thumbsUpCount: number;
        thumbsDownCount: number;
        thumbsUpped: boolean;
        thumbsDowned: boolean;
        repliesLineMode: boolean;
        date: Date;
    }

    export interface IDiscussionViewUiContextInitData {
        allowReplies: boolean;
        currentUser: UI.IDiscussionViewAuthor;
        noAvatars: boolean;
        commentMaxLength: number;
        addCommentsToStart: boolean;
        allowLikes: boolean;
        allowThumbs: boolean;
        replyText?: string;
        editText?: string;
        deleteText?: string;
        cancelText?: string;
        deletedCommentText?: string;
        editor: string;
        deletionType: string;
        deletionConfirmation: boolean;
        deletionConfirmationText: string;
        submitReply(inputData: any): Promise<IReply>;
        viewMode: string;
        maxTreeDepth: number;
        allowAttachemnts: boolean;
        dateFormatter(date: Date): string;
    }

    export interface IDiscussionViewUiContext {
        displayReplies(replies: IReply[]): void;
        initMainInput(): void;
    }

    export interface IDiscussionViewUiContextFactory {
        init(container: IContainer, initData: IDiscussionViewUiContextInitData): Promise<IDiscussionViewUiContext>;
    }
}