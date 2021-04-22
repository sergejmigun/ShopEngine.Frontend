using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ShopEngine.Frontend.Areas.Common;
using ShopEngine.Frontend.Areas.Shopping.Models.Cart;

namespace ShopEngine.Frontend.Areas.Shopping.MvcControllers
{
    public class CartController: Controller
    {
        public ViewResult Index()
        {
            var vm = new CartViewModel();
            LayoutHelper.FillLayoutModel(vm);

            return this.View(vm);
        }
    }
}