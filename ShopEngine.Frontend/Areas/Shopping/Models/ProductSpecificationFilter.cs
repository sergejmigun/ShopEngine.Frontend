using System.Collections.Generic;

namespace ShopEngine.Frontend.Areas.Shopping.Models
{
    public class ProductSpecificationFilter
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public IEnumerable<ProductSpecificationFilterOption> Options { get; set; }
    }
}