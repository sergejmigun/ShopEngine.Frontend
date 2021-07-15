using System.Collections.Generic;
using System.Web.Mvc;
using ShopEngine.Frontend.Areas.Common;
using ShopEngine.Frontend.Areas.Shopping.Models;
using ShopEngine.Frontend.Models.Common;

namespace ShopEngine.Frontend.Areas.Shopping.MvcControllers
{
    public class ProductController : Controller
    {
        public ViewResult Index(int id)
        {
            var vm = new ProductViewModel();
            LayoutHelper.FillLayoutModel(vm);

            vm.SiteMap = new List<LinkViewModel>
            {
                new LinkViewModel{ Link = "#",  Text = "First" },
                new LinkViewModel{ Link = "#",  Text = "Second" },
                new LinkViewModel{ Link = "#",  Text = "Last" }
            };

            vm.SubTitle = "Apple iPhone 12 mini 256GB White";

            vm.Images = new List<ImageModel>
            {
                new ImageModel
                {
                     Source = "https://i2.rozetka.ua/goods/22963788/299109013_images_22963788498.jpg",
                     Thumb = "https://i2.rozetka.ua/goods/22963788/299109013_images_22963788498.jpg",
                     Alt = "PR",
                     Link =  new LinkViewModel{ Link = "#",  Text = "First" }
                },
                 new ImageModel
                {
                     Source = "https://content1.rozetka.com.ua/goods/images/big/180340463.jpg",
                     Thumb = "https://content1.rozetka.com.ua/goods/images/big/180340463.jpg",
                     Alt = "PR",
                     Link =  new LinkViewModel{ Link = "#",  Text = "First" }
                },
                  new ImageModel
                {
                     Source = "https://content.rozetka.com.ua/goods/images/big/180340474.jpg",
                     Thumb = "https://content.rozetka.com.ua/goods/images/big/180340474.jpg",
                     Alt = "PR",
                     Link =  new LinkViewModel{ Link = "#",  Text = "First" }
                }
            };

            vm.Price = 99;
            vm.OldPrice = 88;

            vm.Sku = "3432523";

            vm.ProductTitle = "Apple iPhone 12 mini 256GB White";
            vm.Description = "Экран (6.7'', OLED(Super Retina XDR), 2778x1284) / Apple A14 Bionic / тройная основная камера: 12 Мп + 12 Мп + 12 Мп, фронтальная камера: 12 Мп / 128 ГБ встроенной памяти / 3G / LTE / 5G / GPS / Nano - SIM / iOS 14";

            vm.Specifications = new List<ProductSpecificationItem>
            {
                new ProductSpecificationItem { Name = "Объем", Value = "1 ТБ" },
                new ProductSpecificationItem { Name = "Страна-производитель", Value = "Китай (Тайвань)" },
                new ProductSpecificationItem { Name = "Скорость чтения", Value = "До 1800 МБ/с" },
                new ProductSpecificationItem { Name = "Скорость записи", Value = "До 1800 МБ/с" },
                new ProductSpecificationItem { Name = "Время наработки на отказ", Value = "1 800 000 часов" },
                new ProductSpecificationItem { Name = "Устойчивость к ударным нагрузкам", Value = "1500G / 0.5 мс" },
                new ProductSpecificationItem { Name = "Форм-фактор", Value = "M2" }
            };

            vm.RelatedProducts = new List<ProductItem>
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
                               ProductUrl =  "#",
                               CategoryUrl =  "#",
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
                                 ProductUrl =  "#",
                               CategoryUrl =  "#",
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
                                 ProductUrl =  "#",
                               CategoryUrl =  "#"
                         }
            };

            return this.View(vm);
        }
    }
}