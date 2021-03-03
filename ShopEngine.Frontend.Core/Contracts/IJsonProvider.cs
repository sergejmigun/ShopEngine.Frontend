using System.Dynamic;

namespace ShopEngine.Frontend.Core.Contracts
{
    public interface IJsonProvider
    {
        string Serialize(object obj, bool camelCase = false);

        T Deserialize<T>(string json, bool camelCase = false);

        ExpandoObject DeserializeToDynamic(string json);
    }
}
