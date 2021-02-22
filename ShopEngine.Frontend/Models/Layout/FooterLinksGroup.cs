using System.Collections.Generic;
using ShopEngine.Frontend.Models.Common;

namespace ShopEngine.Frontend.Models.Layout
{
    public class FooterLinksGroup
    {
        public string Title { get; set; }

        public IEnumerable<LinkViewModel> Links { get; set; }
    }
}