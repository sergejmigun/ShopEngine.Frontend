namespace Api.Common.Models {
    export interface ISliderItemModel {
        image: string;
        title: string;
        customText: string;
        customTextPrice: string;
        link: Common.Models.ILinkViewModel;
    }
}