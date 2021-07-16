namespace Api.Shopping.Models {
    export interface ICartViewModel {
        relatedProducts: IProductItem[];
        siteMap: Common.Models.ILinkViewModel[];
        subTitle: string;
        header: Common.Models.IHeaderViewModel;
        footer: Common.Models.IFooterViewModel;
    }
}