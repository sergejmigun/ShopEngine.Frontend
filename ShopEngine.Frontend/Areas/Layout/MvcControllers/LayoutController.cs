using System.Collections.Generic;
using System.Web.Mvc;
using ShopEngine.Frontend.Models.Common;
using ShopEngine.Frontend.Models.Home;
using ShopEngine.Frontend.Models.Layout;
using System.Linq;
using ShopEngine.Frontend.Areas.Layout.ApiControllers;

namespace ShopEngine.Frontend.Areas.Layout.MvcControllers
{
    public class LayoutController : Controller
    {
        public ActionResult Index()
        {
            var vm = new IndexViewModel { };

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
                LogoAlt = "My Tesy Eshop",
                LogoPath = "img/logo/logo.png",
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
                CurrentCurrency = currencies.FirstOrDefault(x => x.Code == ApiControllers.LayoutController.CurrentCurrencyCode) ?? currencies.First(),
                CurrentLanguage = languages.FirstOrDefault(x => x.Code == ApiControllers.LayoutController.CurrentLanguageCode) ?? languages.First(),
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

            vm.PopularBrands = new List<ImageModel>
            {
                new ImageModel { Source = "img/brands/02.png", Alt = "Samsung" }, new ImageModel { Source = "img/brands/03.png", Alt = "Sony" }
            };

            vm.SliderItems = new List<SliderItemModel>
            {
                new SliderItemModel { CustomText = "Buy Now!", Title = "Google Home - Smart Speaker", CustomTextPrice = "359$", Image = "img/hero-slider/logo02.png", Link = new LinkViewModel {  Link = "#", Text = "Go" } },
                new SliderItemModel { CustomText = "View offers", Title = "Modern Powerful Laptop", CustomTextPrice = "1$", Image = "img/hero-slider/logo03.png", Link = new LinkViewModel {  Link = "#", Text = "Go" } }
            };

            return View(vm);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}