using System.Collections.Generic;

namespace ShopEngine.Frontend.Areas.Shopping.Models
{
    public class BrandFilter
    {
        public IEnumerable<ProductSpecificationFilterOption> Options { get; set; }
    }
}