using System.Collections.Generic;
using ShopEngine.Frontend.Models.Layout;

namespace ShopEngine.Frontend.Models.Common
{
    public class InnerContainerViewModel: LayoutViewModel
    {
        public IEnumerable<LinkViewModel> SiteMap { get; set; }

        public string SubTitle { get; set; }
    }
}