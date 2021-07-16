namespace ShopEngine.Frontend.Areas.Shopping.Models.Cart
{
    public class CartItem
    {
        public ProductItem Product { get; set; }

        public int Quantity { get; set; }

        public double? Discount { get; set; }

        public string DiscountStr { get; set; }
    }
}