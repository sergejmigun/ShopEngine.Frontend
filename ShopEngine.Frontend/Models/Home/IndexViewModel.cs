using System.Collections.Generic;
using ShopEngine.Frontend.Models.Common;
using ShopEngine.Frontend.Models.Layout;

namespace ShopEngine.Frontend.Models.Home
{
    public class IndexViewModel: LayoutViewModel
    {
        public IEnumerable<SliderItemModel> SliderItems { get; set; }

        public IEnumerable<ImageModel> PopularBrands { get; set; }
    }
}