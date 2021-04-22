using System;
using System.Linq;
using System.Reflection;
using System.Web.Compilation;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Autofac;
using Autofac.Features.ResolveAnything;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using Newtonsoft.Json.Serialization;
using ShopEngine.Frontend.App_Start;

namespace ShopEngine.Frontend
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            this.InitDependencies();
            this.InitFormatters(GlobalConfiguration.Configuration);
        }

        private void InitDependencies()
        {
            var builder = new ContainerBuilder();
            builder.RegisterSource(new AnyConcreteTypeNotAlreadyRegisteredSource());
            builder.RegisterControllers(typeof(MvcApplication).Assembly);
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            var targetAssemblies = BuildManager.GetReferencedAssemblies().Cast<Assembly>().Where(x => x.FullName.StartsWith("ShopEngine")).ToArray();
            builder.RegisterAssemblyModules(targetAssemblies);
            IContainer container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
            GlobalConfiguration.Configuration.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

        private void InitFormatters(HttpConfiguration config)
        {
            var json = config.Formatters.JsonFormatter;
            var resolver = new CamelCasePropertyNamesContractResolver();
            resolver.NamingStrategy.ProcessDictionaryKeys = true;
            json.SerializerSettings.ContractResolver = resolver;
        }

        protected void Application_BeginRequest(Object sender, EventArgs e)
        {
            var r = RouteTable.Routes;
        }
    }
}
