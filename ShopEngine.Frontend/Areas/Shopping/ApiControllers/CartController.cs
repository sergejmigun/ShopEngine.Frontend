using System.Web.Http;

namespace ShopEngine.Frontend.Areas.Cart.ApiControllers
{
    public class CartController : ApiController
    {
        [HttpPost]
        public object AddItem(int productId)
        {
            return new object[] { "Modern", "Talking" };
        }

        [HttpPost]
        public object RemoveItem(int productId)
        {
            return new object[] { "Modern", "Talking" };
        }

        [HttpPost]
        public object UpdateCount(int productId, int count)
        {
            return new object[] { "Modern", "Talking" };
        }
    }
}