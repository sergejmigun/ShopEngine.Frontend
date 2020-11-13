namespace ShopEngine.Frontend.Models.Common
{
    public class ProductShortInfoModel
    {
        public int ProductId { get; set; }

        public string  Title { get; set; }

        public string Thumb { get; set; }

        public double Price { get; set; }

        public string PriceStr { get; set; }
    }
}