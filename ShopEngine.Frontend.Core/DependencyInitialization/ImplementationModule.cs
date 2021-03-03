
using Autofac;
using ShopEngine.Frontend.Core.Contracts;
using ShopEngine.Frontend.Core.Providers;

namespace ShopEngine.Frontend.Core.DependencyInitialization
{
    public class ImplementationModule
    {
        public class ServicesImplementationModule : Module
        {
            protected override void Load(ContainerBuilder builder)
            {
                // services
                builder.RegisterType<JsonProvider>().As<IJsonProvider>();
            }
        }
    }
}