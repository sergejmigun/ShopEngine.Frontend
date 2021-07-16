using System.Collections.Generic;
using System.Linq;

namespace ShopEngine.Frontend.Areas.Shopping.Models.Cart
{
    public class CartModel
    {
        public List<CartItem> Items { get; } = new List<CartItem>();

        public double? DiscountTotal
        {
            get
            {
                if (this.Items == null || !this.Items.Any())
                {
                    return null;
                }

                return this.Items.Sum(x => x.Discount);
            }
        }

        public string DiscountTotalStr
        {
            get
            {
                if (this.DiscountTotal == null)
                {
                    return null;
                }

                return "$" + this.DiscountTotal;
            }
        }

        public double Total
        {
            get
            {
                if (this.Items == null || !this.Items.Any())
                {
                    return 0;
                }

                return this.Items.Sum(x => x.Product.Price);
            }
        }
    }
}