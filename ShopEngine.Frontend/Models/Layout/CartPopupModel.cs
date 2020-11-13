using System.Collections.Generic;

namespace ShopEngine.Frontend.Models.Layout
{
    public class CartPopupModel
    {
        public IEnumerable<CartItemModel> CartItems { get; set; }

        public double Subtotal { get; set; }

        public string SubtotalStr { get; set; }
    }
}