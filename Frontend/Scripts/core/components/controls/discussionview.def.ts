namespace UI {
    export interface IDiscussionViewEditor {
        getContent(): string;
        getAttachments(): any;
    }

    export interface IDiscussionViewInputBox {
        submit(callback: () => void): void;
        cancel(callback: () => void): void;
        destroy(): void;
        editor: IDiscussionViewEditor;
    }

    export interface IDiscussionViewAuthor {
        avatarUrl: string;
        name: string;
        link: string;
    }

    export interface IDiscussionViewReply {
        replies: IDiscussionViewReply[]
    }

    export interface IDiscussionViewInitData {
        replies: IDiscussionViewReply[];
        allowReplies: boolean;
        allowSubReplies: boolean;
        currentUser: IDiscussionViewAuthor;
        commentMaxLength: number;
        addCommentsToStart: boolean;
        noAvatars: boolean;
    }

    export interface IDiscussionView {
        remove(): void;
    }

    export interface IDiscussionViewFactory {
        init(container: IContainer, initData: IDiscussionViewInitData): Promise<IDiscussionView>;
    }
}