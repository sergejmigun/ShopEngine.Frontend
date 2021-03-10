using System.Collections.Generic;
using ShopEngine.Frontend.Models.Common;

namespace ShopEngine.Frontend.Models.Layout
{
    public class HeaderViewModel
    {
        public IEnumerable<string> Phones { get; set; }

        public IEnumerable<LinkViewModel> HeaderLinks { get; set; }

        public string LogoPath { get; set; }

        public string LogoAlt { get; set; }

        public IEnumerable<CurrencyModel> Currencies { get; set; }

        public CurrencyModel CurrentCurrency { get; set; }

        public IEnumerable<LanguageModel> Languages { get; set; }

        public LanguageModel CurrentLanguage { get; set; }

        public int ComparedItemsCount { get; set; }

        public int CartItemsCount { get; set; }

        public CartPopupModel Cart { get; set; }

        public MenuViewModel Menu { get; set; }

        public CategoriesMenuViewModel CategoriesMenu { get; set; }

        public bool IsLoggedIn { get; set; }
    }
}