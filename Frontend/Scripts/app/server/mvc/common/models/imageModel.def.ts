namespace Api.Common.Models {
    export interface IImageModel {
        source: string;
        thumb: string;
        alt: string;
        link: Common.Models.ILinkViewModel;
    }
}