using System.Collections.Generic;

namespace ShopEngine.Frontend.Areas.Home.Models
{
    public class CategoriesMenuItem
    {
        public string Title { get; set; }

        public string Url { get; set; }

        public string IconUrl { get; set; }

        public IEnumerable<CategoriesMenuItem> SubItems { get; set; }
    }

}