namespace Components.Grid {
    export interface IGridFilterTemplate<T> extends ITemplate<T> {
        onSubmit(handler: (filterData) => void): void;
    }

    export interface IGridModel<T> {
        items: any[];
        gridData: T;
    }

    export interface IGridTemplate<TModel> extends ITemplate<IGridModel<TModel>> {
        refresh(responseData): void;
        onChangeOrder?(handler: (orderData) => void): void;
        onChangeSelection?(handler: () => void): void;
    }

    export interface IGridViewFilter {
        template?: Components.ITemplateInitData<any, IGridFilterTemplate<any>>;
        data?: any;
    }

    export interface IGridViewResponse {
        total: number;
        sortingData?: object;
        gridData?: any;
    }

    export interface IGridViewRequestOrderData {
        column: string;
        direction: number;
    }

    export interface IGridViewRequest {
        pageSize: number;
        page: number;
        orderData?: IGridViewRequestOrderData[];
        searchBy?: string;
        filterData: any;
    }

    export interface IGridViewModel<TGridModel, TGridTemplate extends IGridTemplate<TGridModel>> extends IGridViewModelBase {
        gridTemplateFactory: Components.ITemplateFactory<Components.Grid.IGridModel<TGridModel>, TGridTemplate>;
        gridData: TGridModel;
    }

    export interface IGridViewModelBase {
        fetchingFunc(request: IGridViewRequest): Promise<IGridViewResponse>;
        actions: UI.IDropDownMenuButtonData[];
        gridViewTitle?: string;
        hideFetchingInfo?: boolean;
        gridFilter?: IGridViewFilter;
        hideSearchBox?: boolean;
        hideGridSizeSelection?: boolean;
    }

    export interface IGridView<TGridModel, TGridTemplate extends IGridTemplate<TGridModel>> extends ITemplate<IGridViewModel<TGridModel, TGridTemplate>> {
        grid: TGridTemplate;
        refresh(): void;
    }

    export interface IGridViewFactory<TGridModel, TGridTemplate extends IGridTemplate<TGridModel>> extends Components.ITemplateFactory<IGridViewModel<TGridModel, TGridTemplate>, IGridView<TGridModel, TGridTemplate>> {
    }
}