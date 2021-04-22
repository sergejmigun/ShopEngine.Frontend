using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ShopEngine.Frontend.Areas.Account.Models;
using ShopEngine.Frontend.Areas.Common;

namespace ShopEngine.Frontend.Areas.Account.MvcController
{
    public class OrdersController: Controller
    {
        public ViewResult Index()
        {
            var vm = new OrdersViewModel();
            LayoutHelper.FillLayoutModel(vm);

            return this.View(vm);
        }
    }
}