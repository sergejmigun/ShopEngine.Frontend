using System.Collections.Generic;
using ShopEngine.Frontend.Models.Common;

namespace ShopEngine.Frontend.Areas.Shopping.Models.Cart
{
    public class CartViewModel : InnerContainerViewModel
    {
        public List<ProductItem> RelatedProducts { get; set; }
    }
}