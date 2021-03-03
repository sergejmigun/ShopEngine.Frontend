using System.Dynamic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using ShopEngine.Frontend.Core.Contracts;

namespace ShopEngine.Frontend.Core.Providers
{
    internal class JsonProvider : IJsonProvider
    {
        public string Serialize(object obj, bool camelCase = false)
        {
            if (obj == null)
            {
                return null;
            }

            return JsonConvert.SerializeObject(obj, this.GetSettings(camelCase));
        }

        public T Deserialize<T>(string json, bool camelCase = false)
        {
            if (json == null)
            {
                return default(T);
            }

            return JsonConvert.DeserializeObject<T>(json, this.GetSettings(camelCase));
        }

        public ExpandoObject DeserializeToDynamic(string json)
        {
            return JsonConvert.DeserializeObject<ExpandoObject>(json, new ExpandoObjectConverter());
        }

        private JsonSerializerSettings GetSettings(bool camelCase)
        {
            return new JsonSerializerSettings()
            {
                ContractResolver = camelCase ? new CamelCasePropertyNamesContractResolver() : new DefaultContractResolver()
            };
        }
    }
}
