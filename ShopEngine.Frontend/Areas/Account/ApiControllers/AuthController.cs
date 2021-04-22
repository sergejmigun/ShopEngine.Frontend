using System.Web.Http;
using ShopEngine.Frontend.ApiModels;

namespace ShopEngine.Frontend.Areas.Account.ApiControllers
{
    public class CartController : ApiController
    {
        [HttpPost]
        public object SignIn(int productId)
        {
            return new object[] { "Modern", "Talking" };
        }

        [HttpPost]
        public object SignOut(int productId)
        {
            return new object[] { "Modern", "Talking" };
        }
    }
}