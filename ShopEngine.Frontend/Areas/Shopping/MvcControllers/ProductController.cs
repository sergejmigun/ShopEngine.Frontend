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

            return this.View(vm);
        }
    }
}