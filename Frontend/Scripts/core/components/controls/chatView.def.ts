namespace UI {
    export interface IChatViewPageData {
        messages: IChatViewMessageInitData[];
        hasMoreData: boolean;
    }

    export interface IChatViewMessageAuthorData {
        id: string;
        ava: string;
        name: string;
        customContent?: UI.IUiItemData;
    }

    export interface IChatViewMessageInitData {
        id: string;
        author: IChatViewMessageAuthorData;
        text: string;
        date: Date;
        actions: IDropDownMenuButtonData[];
        isOwn: boolean;
        isRemoved?: boolean;
        customContent?: UI.IUiItemData;
    }

    export interface IChatViewInitData {
        getMessages(token: string, loadOlderData: boolean): Promise<IChatViewPageData>;
        inputBarDisabled?: boolean;
        inputBarCustomContent?: UI.IUiItemData;
    }

    export interface IChatView {
        setInputValue(value: string): void;
        disableInput(): void;
        enableInput(): void;
        focusMessage(messageId): void;
        addMessage(message: IChatViewMessageInitData): void;
        updateMessage(messageId: string, message: string): void;
        removeMessage(messageId): void;
        onMessageSubmit(handler: (message: string) => void): void;
    }

    export interface IChatViewFactory {
        init(container: IContainer, initData: IChatViewInitData): Promise<IChatView>;
    }
}