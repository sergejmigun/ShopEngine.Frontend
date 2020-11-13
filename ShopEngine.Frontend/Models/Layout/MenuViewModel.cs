using System.Collections.Generic;
using ShopEngine.Frontend.Models.Common;

namespace ShopEngine.Frontend.Models.Layout
{
    public class MenuViewModel
    {
        public IEnumerable<LinkViewModel> PopularBrands { get; set; }

        public IEnumerable<LinkViewModel> PopularCategories { get; set; }

        public IEnumerable<LinkViewModel> Pages { get; set; }

        public string AddressLine { get; set; }

        public string Email { get; set; }

        public string Phones { get; set; }
    }
}