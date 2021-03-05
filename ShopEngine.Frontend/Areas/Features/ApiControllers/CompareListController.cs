using System.Web.Http;
using ShopEngine.Frontend.ApiModels;

namespace ShopEngine.Frontend.Areas.Features.ApiControllers
{
    public class CompareListController : ApiController
    {
        [HttpPost]
        public object Add(int productId)
        {
            return new object[] { "Modern", "Talking" };
        }

        [HttpPost]
        public object Remove(int productId)
        {
            return new object[] { "Modern", "Talking" };
        }
    }
}