namespace Api.Common.Models {
    export interface IIndexViewModel {
        sliderItems: Common.Models.ISliderItemModel[];
        popularBrands: Common.Models.IImageModel[];
        header: Common.Models.IHeaderViewModel;
        footer: Common.Models.IFooterViewModel;
    }
}