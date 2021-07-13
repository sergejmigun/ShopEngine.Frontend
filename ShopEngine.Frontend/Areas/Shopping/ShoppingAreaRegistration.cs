using System.Web.Mvc;

namespace ShopEngine.Frontend.Areas.Shopping
{
    public class ShoppingAreaRegistration : AreaRegistration
    {
        public const string DefaultRouteName = "Shopping_default";
        public const string CartRouteName = "Shopping_Cart";
        public const string CheckoutRouteName = "Shopping_Checkout";

        public override string AreaName
        {
            get
            {
                return "Shopping";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                DefaultRouteName,
                "Shopping/{controller}/{action}/{id}",
                new { action = "Category", id = UrlParameter.Optional });

            context.MapRoute(
                CartRouteName,
                "Cart",
                new { action = "Index", controller = "Cart" });

            context.MapRoute(
               CheckoutRouteName,
               "Checkout",
               new { action = "Index", controller = "Checkout" });
        }
    }
}