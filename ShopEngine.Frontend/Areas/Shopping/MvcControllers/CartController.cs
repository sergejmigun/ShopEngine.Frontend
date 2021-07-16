using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ShopEngine.Frontend.Areas.Common;
using ShopEngine.Frontend.Areas.Shopping.Models;
using ShopEngine.Frontend.Areas.Shopping.Models.Cart;
using ShopEngine.Frontend.Models.Common;

namespace ShopEngine.Frontend.Areas.Shopping.MvcControllers
{
    public class CartController: Controller
    {
        public ViewResult Index()
        {
            var vm = new CartViewModel();
            LayoutHelper.FillLayoutModel(vm);

            vm.SiteMap = new List<LinkViewModel>
            {
                new LinkViewModel{ Link = "#",  Text = "First" },
                new LinkViewModel{ Link = "#",  Text = "Second" },
                new LinkViewModel{ Link = "#",  Text = "Last" }
            };

            vm.SubTitle = "Carttttt";

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