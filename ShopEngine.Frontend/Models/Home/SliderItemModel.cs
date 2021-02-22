using ShopEngine.Frontend.Models.Common;

namespace ShopEngine.Frontend.Models.Home
{
    public class SliderItemModel
    {
        public string Image { get; set; }

        public string Title { get; set; }

        public string CustomText { get; set; }

        public string CustomTextPrice { get; set; }

        public LinkViewModel Link { get; set; }
    }
}