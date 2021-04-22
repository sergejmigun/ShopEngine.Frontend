using System.Web.Mvc;
using ShopEngine.Frontend.Areas.Account.Models;
using ShopEngine.Frontend.Areas.Common;

namespace ShopEngine.Frontend.Areas.Account.MvcController
{
    public class MembershipController: Controller
    {
        public new ViewResult Profile()
        {
            var vm = new ProfileViewModel();
            LayoutHelper.FillLayoutModel(vm);

            return this.View(vm);
        }

        public ViewResult PasswordReset()
        {
            var vm = new PasswordResetViewModel();
            LayoutHelper.FillLayoutModel(vm);

            return this.View(vm);
        }

        public ViewResult Registration()
        {
            var vm = new RegistrationViewModel();
            LayoutHelper.FillLayoutModel(vm);

            return this.View(vm);
        }
    }
}