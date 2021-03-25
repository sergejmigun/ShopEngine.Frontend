using System.Collections.Generic;
using System.Web.Mvc;
using ShopEngine.Frontend.Models.Common;
using ShopEngine.Frontend.Models.Home;
using ShopEngine.Frontend.Models.Layout;
using System.Linq;
using ShopEngine.Frontend.Areas.Layout.ApiControllers;
using ShopEngine.Frontend.Areas.Common;

namespace ShopEngine.Frontend.Areas.Home.MvcControllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var vm = new IndexViewModel { };

            LayoutHelper.FillLayoutModel(vm);

            vm.PopularBrands = new List<ImageModel>
            {
                new ImageModel { Source = "img/brands/02.png", Alt = "Samsung" }, new ImageModel { Source = "img/brands/03.png", Alt = "Sony" }
            };

            vm.SliderItems = new List<SliderItemModel>
            {
                new SliderItemModel { CustomText = "Buy Now!", Title = "Google Home - Smart Speaker", CustomTextPrice = "359$", Image = "img/hero-slider/logo02.png", Link = new LinkViewModel {  Link = "#", Text = "Go" } },
                new SliderItemModel { CustomText = "View offers", Title = "Modern Powerful Laptop", CustomTextPrice = "1$", Image = "img/hero-slider/logo03.png", Link = new LinkViewModel {  Link = "#", Text = "Go" } }
            };

            return View(vm);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}