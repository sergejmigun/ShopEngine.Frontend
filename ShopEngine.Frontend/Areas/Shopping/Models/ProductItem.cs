using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShopEngine.Frontend.Areas.Shopping.Models
{
    public class ProductItem
    {
        public int ProductId { get; set; }

        public bool IsSale { get; set; }

        public bool IsOutOfStock { get; set; }

        public string ProductUrl { get; set; }

        public string ProductTitle { get; set; }

        public string ProductImgUrl { get; set; }

        public string CategoryName { get; set; }

        public int CategoryId { get; set; }

        public string PriceStr { get; set; }

        public double Price { get; set; }

        public string OldPriceStr { get; set; }

        public double OldPrice { get; set; }
    }
}