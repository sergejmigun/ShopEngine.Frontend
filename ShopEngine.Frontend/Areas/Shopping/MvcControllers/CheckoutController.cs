using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ShopEngine.Frontend.Areas.Common;
using ShopEngine.Frontend.Areas.Shopping.Models.Cart;
using ShopEngine.Frontend.Areas.Shopping.Models.Checkout;

namespace ShopEngine.Frontend.Areas.Shopping.MvcControllers
{
    public class CheckoutController : Controller
    {
        public ViewResult Index()
        {
            var vm = new CheckoutViewModel();
            LayoutHelper.FillLayoutModel(vm);

            return this.View(vm);
        }
    }
}