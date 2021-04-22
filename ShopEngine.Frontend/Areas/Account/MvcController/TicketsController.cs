using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ShopEngine.Frontend.Areas.Account.Models;
using ShopEngine.Frontend.Areas.Common;

namespace ShopEngine.Frontend.Areas.Account.MvcController
{
    public class TicketsController : Controller
    {
        public ViewResult Browse()
        {
            var vm = new TicketsViewModel();
            LayoutHelper.FillLayoutModel(vm);

            return this.View(vm);
        }

        public ViewResult Item(int id)
        {
            var vm = new TicketViewModel();
            LayoutHelper.FillLayoutModel(vm);

            return this.View(vm);
        }
    }
}