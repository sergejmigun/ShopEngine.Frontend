using System.Collections.Generic;
using ShopEngine.Frontend.Models.Common;
using ShopEngine.Frontend.Models.Layout;

namespace ShopEngine.Frontend.Areas.Shopping.Models
{
    public class BrowseByCategoryViewModel: LayoutViewModel
    {
        public IEnumerable<LinkViewModel> SiteMap { get; set; }

        public CategoryModel Category { get; set; }

        public CategoryBanner CategoryBanner { get; set; }

        public IEnumerable<CategoryModel> SubCategories { get; set; }

        public PriceFilter PriceFilter { get; set; }

        public BrandFilter BrandFilter { get; set; }

        public IEnumerable<ProductSpecificationFilter> Filters { get; set; }
    }
}