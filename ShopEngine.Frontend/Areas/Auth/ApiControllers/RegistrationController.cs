using System.Web.Http;
using ShopEngine.Frontend.ApiModels;

namespace ShopEngine.Frontend.Areas.Auth.ApiControllers
{
    public class RegistrationController : ApiController
    {
        [HttpPost]
        public object Register()
        {
            return new object[] { "Modern", "Talking" };
        }
    }
}