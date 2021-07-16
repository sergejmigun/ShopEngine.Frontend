namespace Api.Shopping.Models {
    export interface IProductViewModel {
        sku: string;
        isSale: boolean;
        images: Common.Models.IImageModel[];
        productTitle: string;
        description: string;
        price: number;
        oldPrice: number | void;
        specifications: IProductSpecificationItem[];
        relatedProducts: IProductItem[];
        siteMap: Common.Models.ILinkViewModel[];
        subTitle: string;
        header: Common.Models.IHeaderViewModel;
        footer: Common.Models.IFooterViewModel;
    }
}