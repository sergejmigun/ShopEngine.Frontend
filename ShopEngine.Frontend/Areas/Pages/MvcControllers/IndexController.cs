using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ShopEngine.Frontend.Areas.Common;
using ShopEngine.Frontend.Areas.Pages.Models;

namespace ShopEngine.Frontend.Areas.Pages.MvcControllers
{
    public class IndexController: Controller
    {
        public ActionResult Index(string pageName)
        {
            var vm = new PageViewModel();
            LayoutHelper.FillLayoutModel(vm);

            return this.View(vm);
        }
    }
}