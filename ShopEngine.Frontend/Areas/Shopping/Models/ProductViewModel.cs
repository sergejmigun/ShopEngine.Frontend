using System.Collections.Generic;
using ShopEngine.Frontend.Models.Common;

namespace ShopEngine.Frontend.Areas.Shopping.Models
{
    public class ProductViewModel : InnerContainerViewModel
    {
        public string Sku { get; set; }

        public bool IsSale { get; set; }

        public List<ImageModel> Images { get; set; }

        public string ProductTitle { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public decimal? OldPrice { get; set; }
    }
}