using ShopEngine.Frontend.Models.Common;

namespace ShopEngine.Frontend.Models.Layout
{
    public class CartItemModel
    {
        public ProductShortInfoModel Product { get; set; }

        public int ProductsCount { get; set; }
    }
}