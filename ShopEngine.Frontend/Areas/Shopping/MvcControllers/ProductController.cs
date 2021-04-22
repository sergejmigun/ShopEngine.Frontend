using System.Web.Mvc;
using ShopEngine.Frontend.Areas.Common;
using ShopEngine.Frontend.Areas.Shopping.Models;

namespace ShopEngine.Frontend.Areas.Shopping.MvcControllers
{
    public class ProductController : Controller
    {
        public ViewResult Index(int id)
        {
            var vm = new ProductViewModel();
            LayoutHelper.FillLayoutModel(vm);

            return this.View(vm);
        }
    }
}