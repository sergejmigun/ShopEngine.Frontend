using System.Collections.Generic;

namespace ShopEngine.Frontend.Models.Layout
{
    public class CategoriesMenuViewModel
    {
        public IEnumerable<CategoriesMenuItem> MainColumn { get; set; }
    }

    public class CategoriesMenuItem
    {
        public string Image { get; set; }

        public string Title { get; set; }

        public string Link { get; set; }
    }
}