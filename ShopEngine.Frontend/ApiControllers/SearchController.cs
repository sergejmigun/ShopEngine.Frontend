using System.Web.Http;
using ShopEngine.Frontend.ApiModels;

namespace ShopEngine.Frontend.ApiControllers
{
    public class SearchController : ApiController
    {
        public object Search(SearchRequest query)
        {
            return new object[] { "Modern", "Talking" };
        }
    }
}