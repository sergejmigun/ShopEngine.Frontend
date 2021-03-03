namespace Pages {
    export interface IPageContext<T> extends Api.Other.Models.IContextDataBaseViewModel {
        model: T;
    }
}
