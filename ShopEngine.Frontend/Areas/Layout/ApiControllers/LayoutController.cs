using System.Collections.Generic;
using System.Web.Http;
using ShopEngine.Frontend.ApiModels;
using ShopEngine.Frontend.Areas.Common.Models;
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
                          Url = Url.Route("Shopping_default", new { controller = "Browse", action = "Category", categoryId = 1  }),
                          SubItems = new List<CategoriesMenuItem>
                          {
                              new CategoriesMenuItem
                              {
                                   Title = "Apple",
                                   Url =   Url.Route("Default", new { controller = "Category", action = "Browse", area = "Shopping", categoryId = 1  }),
                                   SubItems = new List<CategoriesMenuItem>
                                   {
                                       new CategoriesMenuItem
                                       {
                                            Title = "XS Max",
                                                Url = Url.Route("Default", new { controller = "Browse", action = "Category", area = "Shopping", categoryId = 1  }),
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "XS",
                                              Url = Url.Route("Default", new { controller = "Browse", action = "Category", area = "Shopping", categoryId = 1  }),
                                       },
                                       new CategoriesMenuItem
                                       {
                                            Title = "X",
                                               Url = Url.Route("Default", new { controller = "Browse", action = "Category", area = "Shopping", categoryId = 1  }),
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

        [HttpGet]
        public IEnumerable<FeaturedProductCategory> GetFeaturedProductCategories()
        {
            List<FeaturedProductCategory> cat = new List<FeaturedProductCategory>()
            {
                new FeaturedProductCategory
                {
                     CategoryName = "Останні переглянуті товари",
                     ProductItems = new List<ProductItem>
                     {
                         new ProductItem
                         {
                               ProductTitle = "Телевізор Hisense 65U8QF",
                               CategoryId = 1,
                               CategoryName = "TV",
                               IsOutOfStock = true,
                               IsSale = true,
                               OldPrice = 39999,
                               OldPriceStr = "39999$",
                               Price = 11,
                               PriceStr = "11$",
                               ProductId = 1,
                               ProductImgUrl = "https://i8.rozetka.ua/goods/18996404/hisense_65u8qf_images_18996404071.jpg",
                               ProductUrl = "#"
                         },
                         new ProductItem
                         {
                               ProductTitle = "Мобільний телефон Samsung Galaxy S20 FE",
                               CategoryId = 1,
                               CategoryName = "Mobile",
                               IsOutOfStock = true,
                               IsSale = true,
                               OldPrice = 39999,
                               OldPriceStr = "39999$",
                               Price = 11,
                               PriceStr = "11$",
                               ProductId = 1,
                               ProductImgUrl = "https://i2.rozetka.ua/goods/19989841/samsung_sm_g780fzwdsek_images_19989841236.jpg",
                               ProductUrl = "#"
                         },
                         new ProductItem
                         {
                               ProductTitle = "Телевізор Hisense 65U8QF",
                               CategoryId = 1,
                               CategoryName = "TV",
                               IsOutOfStock = true,
                               IsSale = true,
                               OldPrice = 39999,
                               OldPriceStr = "39999$",
                               Price = 11,
                               PriceStr = "11$",
                               ProductId = 1,
                               ProductImgUrl = "https://i8.rozetka.ua/goods/18996404/hisense_65u8qf_images_18996404071.jpg",
                               ProductUrl = "#"
                         },
                         new ProductItem
                         {
                               ProductTitle = "Телевізор Hisense 65U8QF",
                               CategoryId = 1,
                               CategoryName = "TV",
                               IsOutOfStock = true,
                               IsSale = true,
                               OldPrice = 39999,
                               OldPriceStr = "39999$",
                               Price = 11,
                               PriceStr = "11$",
                               ProductId = 1,
                               ProductImgUrl = "https://i2.rozetka.ua/goods/16302470/samsung_galaxy_note_10_lite_6_128_gb_red_sm_n770fzrdsek_images_16302470045.jpg",
                               ProductUrl = "#"
                         },
                         new ProductItem
                         {
                               ProductTitle = "Телевізор Hisense 65U8QF",
                               CategoryId = 1,
                               CategoryName = "TV",
                               IsOutOfStock = true,
                               IsSale = true,
                               OldPrice = 39999,
                               OldPriceStr = "39999$",
                               Price = 11,
                               PriceStr = "11$",
                               ProductId = 1,
                               ProductImgUrl = "https://i8.rozetka.ua/goods/18996404/hisense_65u8qf_images_18996404071.jpg",
                               ProductUrl = "#"
                         },
                         new ProductItem
                         {
                               ProductTitle = "Телевізор Hisense 65U8QF",
                               CategoryId = 1,
                               CategoryName = "TV",
                               IsOutOfStock = true,
                               IsSale = true,
                               OldPrice = 39999,
                               OldPriceStr = "39999$",
                               Price = 11,
                               PriceStr = "11$",
                               ProductId = 1,
                               ProductImgUrl = "https://i8.rozetka.ua/goods/20300848/apple_iphone_12_pro_max_256gb_pacific_blue_images_20300848096.jpg",
                               ProductUrl = "#"
                         }
                     }
                },
                new FeaturedProductCategory
                {
                    CategoryName = "Більше товарів для вибору",
                     ProductItems = new List<ProductItem>
                     {
                         new ProductItem
                         {
                               ProductTitle = "Телевізор Hisense 65U8QF",
                               CategoryId = 1,
                               CategoryName = "TV",
                               IsOutOfStock = true,
                               IsSale = true,
                               OldPrice = 39999,
                               OldPriceStr = "39999$",
                               Price = 11,
                               PriceStr = "11$",
                               ProductId = 1,
                               ProductImgUrl = "https://i8.rozetka.ua/goods/17633585/mystery_mtv_3250fst2_images_17633585581.jpg",
                               ProductUrl = "#"
                         },
                         new ProductItem
                         {
                               ProductTitle = "Мобільний телефон Samsung Galaxy S20 FE",
                               CategoryId = 1,
                               CategoryName = "Mobile",
                               IsOutOfStock = true,
                               IsSale = true,
                               OldPrice = 39999,
                               OldPriceStr = "39999$",
                               Price = 11,
                               PriceStr = "11$",
                               ProductId = 1,
                               ProductImgUrl = "https://i2.rozetka.ua/goods/19989841/samsung_sm_g780fzwdsek_images_19989841236.jpg",
                               ProductUrl = "#"
                         },
                         new ProductItem
                         {
                               ProductTitle = "Телевізор Hisense 65U8QF",
                               CategoryId = 1,
                               CategoryName = "TV",
                               IsOutOfStock = true,
                               IsSale = true,
                               OldPrice = 39999,
                               OldPriceStr = "39999$",
                               Price = 11,
                               PriceStr = "11$",
                               ProductId = 1,
                               ProductImgUrl = "https://i8.rozetka.ua/goods/18996404/hisense_65u8qf_images_18996404071.jpg",
                               ProductUrl = "#"
                         },
                         new ProductItem
                         {
                               ProductTitle = "Телевізор Hisense 65U8QF",
                               CategoryId = 1,
                               CategoryName = "TV",
                               IsOutOfStock = true,
                               IsSale = true,
                               OldPrice = 39999,
                               OldPriceStr = "39999$",
                               Price = 11,
                               PriceStr = "11$",
                               ProductId = 1,
                               ProductImgUrl = "https://i8.rozetka.ua/goods/17633585/mystery_mtv_3250fst2_images_17633585581.jpg",
                               ProductUrl = "#"
                         },
                         new ProductItem
                         {
                               ProductTitle = "Телевізор Hisense 65U8QF",
                               CategoryId = 1,
                               CategoryName = "TV",
                               IsOutOfStock = true,
                               IsSale = true,
                               OldPrice = 39999,
                               OldPriceStr = "39999$",
                               Price = 11,
                               PriceStr = "11$",
                               ProductId = 1,
                               ProductImgUrl = "https://i8.rozetka.ua/goods/18996404/hisense_65u8qf_images_18996404071.jpg",
                               ProductUrl = "#"
                         },
                         new ProductItem
                         {
                               ProductTitle = "Телевізор Hisense 65U8QF",
                               CategoryId = 1,
                               CategoryName = "TV",
                               IsOutOfStock = true,
                               IsSale = true,
                               OldPrice = 39999,
                               OldPriceStr = "39999$",
                               Price = 11,
                               PriceStr = "11$",
                               ProductId = 1,
                               ProductImgUrl = "https://i2.rozetka.ua/goods/16302470/samsung_galaxy_note_10_lite_6_128_gb_red_sm_n770fzrdsek_images_16302470045.jpg",
                               ProductUrl = "#"
                         },
                         new ProductItem
                         {
                               ProductTitle = "Телевізор Hisense 65U8QF",
                               CategoryId = 1,
                               CategoryName = "TV",
                               IsOutOfStock = true,
                               IsSale = true,
                               OldPrice = 39999,
                               OldPriceStr = "39999$",
                               Price = 11,
                               PriceStr = "11$",
                               ProductId = 1,
                               ProductImgUrl = "https://i8.rozetka.ua/goods/18996404/hisense_65u8qf_images_18996404071.jpg",
                               ProductUrl = "#"
                         },
                         new ProductItem
                         {
                               ProductTitle = "Телевізор Hisense 65U8QF",
                               CategoryId = 1,
                               CategoryName = "TV",
                               IsOutOfStock = true,
                               IsSale = true,
                               OldPrice = 39999,
                               OldPriceStr = "39999$",
                               Price = 11,
                               PriceStr = "11$",
                               ProductId = 1,
                               ProductImgUrl = "https://i8.rozetka.ua/goods/20300848/apple_iphone_12_pro_max_256gb_pacific_blue_images_20300848096.jpg",
                               ProductUrl = "#"
                         }
                     }
                }
            };

            return cat;
        }
    }
}