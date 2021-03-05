using System.Web.Mvc;

namespace ShopEngine.Frontend.Areas.Cart
{
    public class CartAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Cart";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Cart_default",
                "Cart/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional });
        }
    }
}