namespace Api.Shopping.Models {
    export interface IBrowseByCategoryViewModel {
        category: ICategoryModel;
        categoryBanner: ICategoryBanner;
        subCategories: ICategoryModel[];
        priceFilter: IPriceFilter;
        brandFilter: IBrandFilter;
        filters: IProductSpecificationFilter[];
        siteMap: Common.Models.ILinkViewModel[];
        subTitle: string;
        header: Common.Models.IHeaderViewModel;
        footer: Common.Models.IFooterViewModel;
    }
}