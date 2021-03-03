namespace UI {
    export interface ITreeViewNode extends ITreeViewNodeInitData {
        parent: ITreeViewNode;
        remove: () => void;
        insert: (index: number, node: ITreeViewNodeInitData) => void;
        append: (node: ITreeViewNodeInitData) => void;
        prepend: (node: ITreeViewNodeInitData) => void;
        after: (node: ITreeViewNodeInitData) => void;
        before: (node: ITreeViewNodeInitData) => void;
        walkChildNodes: (action: (node: ITreeViewNode) => void) => void;
        walkNodes: (action: (node: ITreeViewNode) => void) => void;
        tree: ITreeView;
    }

    export interface ITreeViewNodeInitData {
        data: any;
        nodes: ITreeViewNode[];
        lazyLoading?: boolean;
        expanded?: boolean;
        selectable?: boolean;
        selected?: boolean;
        renderCompleted?: (res: any) => void;
    }

    export interface ITreeViewInitData {
        nodes: ITreeViewNodeInitData[];
    }

    export interface ITreeView {
        insert(index: number, node: ITreeViewNodeInitData): void;
        append(node: ITreeViewNodeInitData): void;
        prepend(node: ITreeViewNodeInitData): void;
        walkTree(action: (node: ITreeViewNode) => void): void;
        walkChildNodes(action: (node: ITreeViewNode) => void): void;
        renderCompleted(handler: () => void): void;
        renderItemCompleted(handler: () => void): void;
        onToggle(handler: (data, expanded: boolean) => void): void;
    }

    export interface ITreeViewFactory {
        init(container: IContainer, initData: ITreeViewInitData): Promise<ITreeView>;
    }
}
