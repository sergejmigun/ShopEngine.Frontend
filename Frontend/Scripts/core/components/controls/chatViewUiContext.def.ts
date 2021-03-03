namespace Services.ChatView {
    export interface IChatViewPageTokens {
        first: string;
        last: string;
    }

    export interface IChatViewUiContextInitData {
        title: string;
        removedMessageText: string;
        showMessageStatus: boolean;
        canReply: boolean;
        splitByDays: boolean;
        ownMessageAlignment: UI.ChatViewOwnMessageAlignment
        getMessages(token: string, loadOlderData: boolean): Promise<any>;
        inputBarDisabled: boolean;
        inputBarCustomContent?: UI.IUiItemData;
    }

    export interface IChatViewUiContext {
        addMessage(newMessage, prevMessage, nextMessage): void;
        removeMessage(removedMessage, prevMessage, nextMessage): void;
        scrollTo(message): void;
        updateMessageBoxPosition(): void;
        refresh(): Promise<any>;
        getMessage(): string;
        setData(data): void;
        setInputValue(value: string): void;
        setInputState(disabled: boolean): void;
        onContentChanged(handler: () => void): void;
        onMessageSubmit(handler: () => void): void;
        onPageCleared(handler: (page) => void): void;
    }

    export interface IChatViewUiContextFactory {
        init(container: IContainer, initData: IChatViewUiContextInitData): Promise<IChatViewUiContext>;
    }
}
