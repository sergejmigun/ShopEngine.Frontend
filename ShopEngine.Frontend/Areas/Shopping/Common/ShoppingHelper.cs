using System.Web.Http.Routing;

namespace ShopEngine.Frontend.Areas.Shopping.Common
{
    public static class ShoppingHelper
    {
        public static string GetUrl(this UrlHelper url, string controller, string action, int id)
        {
            return url.Route(ShoppingAreaRegistration.DefaultRouteName, new { controller = controller, action = action, categoryId = id });
        }

        public static string GetBrowseCategoryUrl(this UrlHelper url, int id)
        {
            return url.Route(ShoppingAreaRegistration.DefaultRouteName, new { controller = "Browse", action = "Category", categoryId = id });
        }

        public static string GetProductUrl(this UrlHelper url, int id)
        {
            return url.Route(ShoppingAreaRegistration.DefaultRouteName, new { controller = "Product", action = "Index", id = id });
        }
    }
}