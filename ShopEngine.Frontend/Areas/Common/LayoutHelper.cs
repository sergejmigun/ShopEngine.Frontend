using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ShopEngine.Frontend.Areas.Layout.ApiControllers;
using ShopEngine.Frontend.Models.Common;
using ShopEngine.Frontend.Models.Layout;

namespace ShopEngine.Frontend.Areas.Common
{
    public static class LayoutHelper
    {
        public static void FillLayoutModel(LayoutViewModel vm)
        {
            var languages = new List<LanguageModel>
                 {
                      new LanguageModel
                      {
                          Code = "FR",
                          Title = "Français",
                          ShortTitle = "Fra"
                      },
                      new LanguageModel
                      {
                          Code = "DE",
                          Title = "Deutsch",
                          ShortTitle = "Deu"
                      }
                 };

            var currencies = new List<CurrencyModel>
                 {
                     new CurrencyModel
                     {
                          Code = "USD",
                          Title = "USD",
                          Sign = "$"
                     },
                     new CurrencyModel
                     {
                          Code = "EUR",
                          Title = "EUR",
                          Sign = "€"
                     },
                     new CurrencyModel
                     {
                          Code = "UKP",
                          Title = "UKP",
                          Sign = "£"
                     }
                 };

            vm.Header = new HeaderViewModel
            {
                Phones = new List<string> { "044 210 21 54", "+3 (80) 979 713 855" },
                HeaderLinks = new List<LinkViewModel>
                 {
                     new LinkViewModel { Link= "#", Text = "Blog" },
                     new LinkViewModel { Link= "#", Text = "Actions" },
                     new LinkViewModel { Link= "#", Text = "About Us" }
                 },
                IsLoggedIn = true,
                LogoAlt = "My Tesy Eshop",
                LogoPath = "/img/logo/logo.png",
                Cart = new CartPopupModel
                {
                    CartItems = new List<CartItemModel>
                     {
                         new CartItemModel
                         {
                             Product = new ProductShortInfoModel
                             {
                                 Price = 12,
                                 PriceStr = "$12",
                                 ProductId = 1,
                                 Thumb = "/shop/widget/04.jpg",
                                 Title = "IPhone"
                             },
                             ProductsCount = 1
                         },
                         new CartItemModel
                         {
                             Product = new ProductShortInfoModel
                             {
                                 Price = 12,
                                 PriceStr = "$12",
                                 ProductId = 1,
                                 Thumb = "/shop/widget/03.jpg",
                                 Title = "Samsung"
                             },
                             ProductsCount = 2
                         }
                     },
                    Subtotal = 22,
                    SubtotalStr = "$22"
                },
                CartItemsCount = 2,
                ComparedItemsCount = 5,
                Currencies = currencies,
                CurrentCurrency = currencies.FirstOrDefault(x => x.Code == LayoutController.CurrentCurrencyCode) ?? currencies.First(),
                CurrentLanguage = languages.FirstOrDefault(x => x.Code == LayoutController.CurrentLanguageCode) ?? languages.First(),
                Languages = languages,
                Menu = new MenuViewModel
                {
                    AddressLine = "514 S. Magnolia St. Orlando, FL 32806, USA",
                    Email = "orlando.store@unishop.com",
                    Phones = "+1 (786) 322 560 40",
                    PopularBrands = new List<LinkViewModel>
                      {
                          new LinkViewModel { Link= "#", Text = "Samsung" },
                          new LinkViewModel { Link= "#", Text = "Apple" },
                          new LinkViewModel { Link= "#", Text = "HTC" }
                      },
                    Pages = new List<LinkViewModel>
                      {
                          new LinkViewModel { Link= "#", Text = "Samsung" },
                          new LinkViewModel { Link= "#", Text = "Apple" },
                          new LinkViewModel { Link= "#", Text = "HTC" }
                      },
                    PopularCategories = new List<LinkViewModel>
                      {
                          new LinkViewModel { Link= "#", Text = "Samsung" },
                          new LinkViewModel { Link= "#", Text = "Apple" },
                          new LinkViewModel { Link= "#", Text = "HTC" }
                      }
                }
            };

            vm.Footer = new FooterViewModel
            {
                LinkGroup1 = new FooterLinksGroup
                {
                    Title = "Shop Departments",
                    Links = new List<LinkViewModel>
                      {
                          new LinkViewModel { Link = "#", Text = "Computers & Accessories" },
                          new LinkViewModel { Link = "#", Text = "Smartphones & Tablets" },
                          new LinkViewModel { Link = "#", Text = "TV, Video & Audio" },
                          new LinkViewModel { Link = "#", Text = "Headphones" },
                          new LinkViewModel { Link = "#", Text = "Cameras, Photo & Video" }
                      }
                },
                LinkGroup2 = new FooterLinksGroup
                {
                    Title = "About Us",
                    Links = new List<LinkViewModel>
                      {
                          new LinkViewModel { Link = "#", Text = "Computers & Accessories" },
                          new LinkViewModel { Link = "#", Text = "Smartphones & Tablets" },
                          new LinkViewModel { Link = "#", Text = "TV, Video & Audio" },
                          new LinkViewModel { Link = "#", Text = "Headphones" },
                          new LinkViewModel { Link = "#", Text = "Cameras, Photo & Video" }
                      }
                },
                LinkGroup3 = new FooterLinksGroup
                {
                    Title = "Account & Shipping Info",
                    Links = new List<LinkViewModel>
                      {
                          new LinkViewModel { Link = "#", Text = "Computers & Accessories" },
                          new LinkViewModel { Link = "#", Text = "Smartphones & Tablets" },
                          new LinkViewModel { Link = "#", Text = "TV, Video & Audio" },
                          new LinkViewModel { Link = "#", Text = "Headphones" },
                          new LinkViewModel { Link = "#", Text = "Cameras, Photo & Video" }
                      }
                }
            };
        }
    }
}