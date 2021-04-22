using System.Collections;
using System.Collections.Generic;
using ShopEngine.Frontend.Areas.Shopping.Models;

namespace ShopEngine.Frontend.Areas.Layout.Models
{
    public class FeaturedProductCategory
    {
        public string CategoryName { get; set; }

        public IEnumerable<ProductItem> ProductItems { get; set; }
    }
}