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
                "Shopping/{controller}/{action}/{categoryId}",
                new { action = "Category", categoryId = UrlParameter.Optional });
        }
    }
}