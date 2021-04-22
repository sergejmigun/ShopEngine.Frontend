using System.Web.Mvc;

namespace ShopEngine.Frontend.Areas.Pages
{
    public class PagesAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Pages";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Pages_default",
                "Pages/{pageName}",
                new { action = "Index", controller = "Index", pageName = UrlParameter.Optional });//.DataTokens.Add("area", "Pages");
        }
    }
}