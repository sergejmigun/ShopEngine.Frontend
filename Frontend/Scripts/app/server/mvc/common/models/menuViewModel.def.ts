namespace Api.Common.Models {
    export interface IMenuViewModel {
        popularBrands: Common.Models.ILinkViewModel[];
        popularCategories: Common.Models.ILinkViewModel[];
        pages: Common.Models.ILinkViewModel[];
        addressLine: string;
        email: string;
        phones: string;
    }
}