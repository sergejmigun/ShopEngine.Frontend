namespace Api.Shopping.Models {
    export interface IBrowseByCategoryViewModel {
        siteMap: Common.Models.ILinkViewModel[];
        category: ICategoryModel;
        subCategories: ICategoryModel[];
        priceFilter: IPriceFilter;
        brandFilter: IBrandFilter;
        filters: IProductSpecificationFilter[];
        header: Common.Models.IHeaderViewModel;
        footer: Common.Models.IFooterViewModel;
    }
}