using System.Web.Http;
using ShopEngine.Frontend.ApiModels;
using ShopEngine.Frontend.Areas.Auth.Models;

namespace ShopEngine.Frontend.Areas.Auth.ApiControllers
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