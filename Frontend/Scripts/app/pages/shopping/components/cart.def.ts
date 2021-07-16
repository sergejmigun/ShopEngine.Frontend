namespace UI {
    export interface ICartInitData {
    }

    export interface ICart {
    }

    export interface ICartFactory {
        init(container: IContainer, initData: ICartInitData): Promise<ICart>;
    }
}