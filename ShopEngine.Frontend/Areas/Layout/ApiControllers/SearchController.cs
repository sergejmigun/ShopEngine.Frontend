using System.Web.Http;
using ShopEngine.Frontend.ApiModels;

namespace ShopEngine.Frontend.Areas.Layout.ApiControllers
{
    public class SearchController : ApiController
    {
        [HttpPost]
        public object Search(SearchRequest query)
        {
            return new object[] { "Modern", "Talking" };
        }
    }
}