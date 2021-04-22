using System.Web.Http;
using ShopEngine.Frontend.ApiModels;
using ShopEngine.Frontend.Areas.Account.Models;

namespace ShopEngine.Frontend.Areas.Account.ApiControllers
{
    public class AccountController : ApiController
    {
        [HttpGet]
        public object GetAccountInfo()
        {
            return new AccountDetails { };
        }
    }
}