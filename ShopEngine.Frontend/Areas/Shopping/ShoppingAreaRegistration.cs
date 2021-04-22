using System.Web.Mvc;

namespace ShopEngine.Frontend.Areas.Shopping
{
    public class ShoppingAreaRegistration : AreaRegistration
    {
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
                "Shopping_default",
                "Shopping/{controller}/{action}/{id}",
                new { action = "Category", id = UrlParameter.Optional });

            context.MapRoute(
                "Shopping_Cart",
                "Cart",
                new { action = "Index", controller = "Cart" });

            context.MapRoute(
               "Shopping_Checkout",
               "Checkout",
               new { action = "Index", controller = "Checkout" });
        }
    }
}