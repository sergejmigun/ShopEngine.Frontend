using System.Web.Mvc;
using ShopEngine.Frontend.Areas.Account.Models;
using ShopEngine.Frontend.Areas.Common;

namespace ShopEngine.Frontend.Areas.Account.MvcControllers
{
    public class ListsController : Controller
    {
        public ViewResult CompareList()
        {
            var vm = new CompareListViewModel();
            LayoutHelper.FillLayoutModel(vm);

            return this.View(vm);
        }

        public ViewResult Wishlist()
        {
            var vm = new WishlistViewModel();
            LayoutHelper.FillLayoutModel(vm);

            return this.View(vm);
        }
    }
}