using System.Collections.Generic;
using System.Web.Http;
using ShopEngine.Frontend.ApiModels;
using ShopEngine.Frontend.Areas.Layout.Models;

namespace ShopEngine.Frontend.Areas.Layout.ApiControllers
{
    public class LayoutController : ApiController
    {
        public static string CurrentLanguageCode;
        public static string CurrentCurrencyCode;

        [HttpGet]
        public CategoriesMenu GetCategoriesMenu()
        {
            return new CategoriesMenu
            {
                 TopItems = new List<CategoriesMenuItem>
                 {
                     new CategoriesMenuItem
                     {
                          IconUrl = "https://www.foxtrot.com.ua/src/images/icons/menu/32030_r.svg",
                          Title = "Smartphones",
                          Url = "#",
                          SubItems = new List<CategoriesMenuItem>
                          {
                              new CategoriesMenuItem
                              {
                                   Title = "Apple",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "XS Max",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "XS",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "X",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "11 pro",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "11 pro max",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "12 pro",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "12 pro max",
                                            Url = "#"
                                       }
                                   }
                              },
                              new CategoriesMenuItem
                              {
                                   Title = "Samsung",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "S20 Galaxy",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "S20+ Galaxy",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "S10 Galaxy",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "S10+ Galaxy",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "S20 FE Galaxy",
                                            Url = "#"
                                       }
                                   }
                              },
                              new CategoriesMenuItem
                              {
                                   Title = "Other",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "Nokia",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "One +",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Xiaomi",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Motorola",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "LG",
                                            Url = "#"
                                       }
                                   }
                              },
                              new CategoriesMenuItem
                              {
                                   Title = "Top Sales",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "Large screen",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Full SIze",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Cheap",
                                            Url = "#"
                                       }
                                   }
                              },
                              new CategoriesMenuItem
                              {
                                   Title = "Promotions",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "Free backup",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Recovery",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Discount",
                                            Url = "#"
                                       }
                                   }
                              },
                              new CategoriesMenuItem
                              {
                                   Title = "Accesories",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "Cases",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Glasses",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Other stuff",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Covers",
                                            Url = "#"
                                       }
                                   }
                              }
                          }
                     },
                     new CategoriesMenuItem
                     {
                          IconUrl = "https://www.foxtrot.com.ua/src/images/icons/menu/32030_r.svg",
                          Title = "Smartphones2",
                          Url = "#",
                          SubItems = new List<CategoriesMenuItem>
                          {
                              new CategoriesMenuItem
                              {
                                   Title = "Apple",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "XS Max",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "XS",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "X",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "11 pro",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "11 pro max",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "12 pro",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "12 pro max",
                                            Url = "#"
                                       }
                                   }
                              },
                              new CategoriesMenuItem
                              {
                                   Title = "Samsung",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "S20 Galaxy",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "S20+ Galaxy",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "S10 Galaxy",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "S10+ Galaxy",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "S20 FE Galaxy",
                                            Url = "#"
                                       }
                                   }
                              },
                              new CategoriesMenuItem
                              {
                                   Title = "Other",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "Nokia",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "One +",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Xiaomi",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Motorola",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "LG",
                                            Url = "#"
                                       }
                                   }
                              },
                              new CategoriesMenuItem
                              {
                                   Title = "Top Sales",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "Large screen",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Full SIze",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Cheap",
                                            Url = "#"
                                       }
                                   }
                              },
                              new CategoriesMenuItem
                              {
                                   Title = "Promotions",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "Free backup",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Recovery",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Discount",
                                            Url = "#"
                                       }
                                   }
                              },
                              new CategoriesMenuItem
                              {
                                   Title = "Accesories",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "Cases",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Glasses",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Other stuff",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Covers",
                                            Url = "#"
                                       }
                                   }
                              }
                          }
                     },
                     new CategoriesMenuItem
                     {
                          IconUrl = "https://www.foxtrot.com.ua/src/images/icons/menu/32014.svg",
                          Title = "TVs",
                          Url = "#",
                          SubItems = new List<CategoriesMenuItem>
                          {
                              new CategoriesMenuItem
                              {
                                   Title = "Other",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "Nokia",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "One +",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Xiaomi",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Motorola",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "LG",
                                            Url = "#"
                                       }
                                   }
                              },
                              new CategoriesMenuItem
                              {
                                   Title = "Top Sales",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "Large screen",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Full SIze",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Cheap",
                                            Url = "#"
                                       }
                                   }
                              },
                              new CategoriesMenuItem
                              {
                                   Title = "Promotions",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "Free backup",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Recovery",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Discount",
                                            Url = "#"
                                       }
                                   }
                              },
                              new CategoriesMenuItem
                              {
                                   Title = "Accesories",
                                   Url =   "#",
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "Cases",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Glasses",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Other stuff",
                                            Url = "#"
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "Covers",
                                            Url = "#"
                                       }
                                   }
                              }
                          }
                     }
                 }
            };
        }

        [HttpPost]
        public void SetLanguage([FromBody]string languageCode)
        {
            CurrentLanguageCode = languageCode;
        }

        [HttpPost]
        public void SetCurrency([FromBody]string currencyCode)
        {
            CurrentCurrencyCode = currencyCode;
        }
    }
}