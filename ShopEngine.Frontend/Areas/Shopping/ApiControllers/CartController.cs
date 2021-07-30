using System.Collections.Generic;
using System.Web.Http;
using ShopEngine.Frontend.Areas.Shopping.Common;
using ShopEngine.Frontend.Areas.Shopping.Models;
using ShopEngine.Frontend.Areas.Shopping.Models.Cart;

namespace ShopEngine.Frontend.Areas.Shopping.ApiControllers
{
    public class CartController : ApiController
    {
        public static CartModel _cart = null;

        public CartController()
        {
        }

        private void FillCart()
        {
            var products = new List<ProductItem>
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
                               ProductUrl =  Url.GetProductUrl(1),
                               CategoryUrl = Url.GetBrowseCategoryUrl(1)
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
                               Price = 12,
                               PriceStr = "12$",
                               ProductId = 1,
                               ProductImgUrl = "https://i2.rozetka.ua/goods/19989841/samsung_sm_g780fzwdsek_images_19989841236.jpg",
                               ProductUrl =  Url.GetProductUrl(1),
                               CategoryUrl = Url.GetBrowseCategoryUrl(1)
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
                               Price = 44,
                               PriceStr = "44$",
                               ProductId = 1,
                               ProductImgUrl = "https://i8.rozetka.ua/goods/18996404/hisense_65u8qf_images_18996404071.jpg",
                               ProductUrl =  Url.GetProductUrl(1),
                               CategoryUrl = Url.GetBrowseCategoryUrl(1)
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
                               ProductUrl = "#",
                               CategoryUrl = ""
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
                               ProductUrl = "#",
                               CategoryUrl = ""
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
                               ProductUrl = "#",
                               CategoryUrl = ""
                         }
                     };

            foreach (var p in products)
            {
                _cart.Items.Add(new CartItem
                {
                    Discount = 10,
                    DiscountStr = "$25",
                    Product = p,
                    Quantity = 2
                });
            }
        }

        [HttpGet]
        public CartModel GetCart()
        {
            if (_cart == null)
            {
                _cart = new CartModel();
                FillCart();
            }

            return _cart;
        }

        [HttpPost]
        public CartModel AddCartItem(CartItem item)
        {
            _cart.Items.Add(item);
            return _cart;
        }

        [HttpPost]
        public CartModel UpdateCart(CartModel cart)
        {
            _cart = cart;
            return _cart;
        }
    }
}