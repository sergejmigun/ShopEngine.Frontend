using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Resources;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using ShopEngine.Frontend.Areas.Other.Models;
using ShopEngine.Frontend.Core.Contracts;
using ShopEngine.Frontend.Resources;

namespace ShopEngine.Frontend.Areas.Other.Controllers
{
    public class ScriptsController : Controller
    {
        private readonly IJsonProvider jsonProvider;
        private readonly IEnumerable<Type> areaTypes;

        public ScriptsController(IJsonProvider jsonProvider)
        {
            this.jsonProvider = jsonProvider;
            this.areaTypes = Assembly.GetExecutingAssembly().GetTypes().Where(t => t.IsSubclassOf(typeof(AreaRegistration))).ToList();
        }

        [HttpGet]
        [OutputCache(Duration = 300, Location = OutputCacheLocation.Server)]
        public JavaScriptResult Resources()
        {
            var sb = new StringBuilder();
            sb.AppendLine("app.registerModule('Resources', [function () {");
            sb.AppendLine(" 'use strict';");
            sb.AppendLine(null);
            sb.AppendLine(" var module = {};");
            sb.AppendLine(null);
            sb.AppendLine(this.GetResourceScriptObject(UI.ResourceManager, "UI"));
            sb.AppendLine(" return { module: module };");
            sb.AppendLine("}]);");

            return this.JavaScript(sb.ToString());
        }

        [HttpGet]
        [OutputCache(Duration = 300, Location = OutputCacheLocation.Server)]
        public JavaScriptResult Urls()
        {
            var types = Assembly.GetExecutingAssembly().GetTypes();

            var sb = new StringBuilder();
            sb.AppendLine("app.registerModule('Urls', [function () {");
            sb.AppendLine(" 'use strict';");
            sb.AppendLine(null);
            sb.AppendLine(" var module = {};");
            sb.AppendLine(null);
            sb.AppendLine(this.GetUrlsScriptObject(
                new ScriptUrlsInfo
                {
                    JsObjectName = "mvc",
                    UrlType = UrlRequestType.Web,
                    ControllerType = typeof(Controller),
                    GetAttributeType = typeof(HttpGetAttribute),
                    PostAttributeType = typeof(HttpPostAttribute),
                    DeleteAttributeType = typeof(HttpDeleteAttribute),
                    PutAttributeType = typeof(HttpPutAttribute),
                    NonActionAttributeType = typeof(NonActionAttribute)
                },
                types,
                (controller, action, controllerType) => Url.Action(action, controller, new { area = this.GetControllerArea(controllerType) })));
            sb.AppendLine();
            sb.AppendLine(this.GetUrlsScriptObject(
                new ScriptUrlsInfo
                {
                    JsObjectName = "api",
                    UrlType = UrlRequestType.Ajax,
                    ControllerType = typeof(System.Web.Http.ApiController),
                    GetAttributeType = typeof(System.Web.Http.HttpGetAttribute),
                    PostAttributeType = typeof(System.Web.Http.HttpPostAttribute),
                    DeleteAttributeType = typeof(System.Web.Http.HttpDeleteAttribute),
                    PutAttributeType = typeof(System.Web.Http.HttpPutAttribute),
                    NonActionAttributeType = typeof(System.Web.Http.NonActionAttribute)
                },
                types,
                (controller, action, controllerType) => Url.RouteUrl("DefaultApiWithAction", new { httproute = string.Empty, controller = controller, action = action })));
            sb.AppendLine(" return { module: module };");
            sb.AppendLine("}]);");

            return this.JavaScript(sb.ToString());
        }

        [ChildActionOnly]
        public ViewResult Context(object pageModel)
        {
            var contextData = new ContextData
            {
                Primarylanguage = "en",
                Model = pageModel,
                AntiForgeryToken = string.Empty
            };

            var model = new ContextViewModel
            {
                ContextDataJson = this.jsonProvider.Serialize(contextData, true)
            };

            return this.View(model);
        }

        private string GetResourceScriptObject(ResourceManager resourceManager, string name)
        {
            var sb = new StringBuilder();
            ResourceSet resourceSet = resourceManager.GetResourceSet(CultureInfo.CurrentUICulture, true, true);
            sb.AppendLine(string.Format(" module.{0} = {{", name));
            var strbInner = new StringBuilder();

            foreach (DictionaryEntry res in resourceSet)
            {
                strbInner.AppendLine(string.Format("   {0}: '{1}',", res.Key.ToString().FirstCharacterToLower(), HttpUtility.JavaScriptStringEncode(res.Value as string)));
            }

            string innerString = strbInner.ToString();

            innerString = innerString?.TrimEnd(',');

            sb.Append(innerString);
            sb.AppendLine(" };");

            return sb.ToString();
        }

        private string GetUrlsScriptObject(ScriptUrlsInfo urlsInfo, IEnumerable<Type> assemblyTypes, Func<string, string, Type, string> getUrlFunc)
        {
            var sb = new StringBuilder();
            sb.AppendLine(string.Format(" module.{0} = {{", urlsInfo.JsObjectName));
            sb.AppendLine(string.Format("    $type: '{0}',", urlsInfo.UrlType.ToString().FirstCharacterToLower()));
            sb.AppendLine(this.GetControllerUrls(assemblyTypes, urlsInfo, getUrlFunc));

            sb.AppendLine(" };");

            return sb.ToString();
        }

        private string GetControllerUrls(IEnumerable<Type> assemblyTypes, ScriptUrlsInfo urlsInfo, Func<string, string, Type, string> getUrlFunc)
        {
            var sb = new StringBuilder();

            foreach (Type type in assemblyTypes)
            {
                if (urlsInfo.ControllerType.IsAssignableFrom(type))
                {
                    string controllerName = type.Name.Substring(0, type.Name.Length - 10);

                    sb.AppendLine(string.Format("    {0}: {{", controllerName.FirstCharacterToLower()));

                    sb.AppendLine(string.Format("    $area: '{0}',", this.GetControllerArea(type).FirstCharacterToLower()));

                    IEnumerable<MethodInfo> actions = type.GetMethods(BindingFlags.Instance | BindingFlags.DeclaredOnly | BindingFlags.Public)
                        .Where(method => !method.IsDefined(urlsInfo.NonActionAttributeType));

                    sb.AppendLine(this.GetActionUrls(actions, urlsInfo, getUrlFunc, controllerName));
                    sb.AppendLine("    },");
                }
            }

            return sb.ToString().TrimEnd().TrimEnd(',');
        }

        private string GetActionUrls(IEnumerable<MethodInfo> actions, ScriptUrlsInfo urlsInfo, Func<string, string, Type, string> getUrlFunc, string controllerName)
        {
            var sb = new StringBuilder();

            foreach (MethodInfo action in actions)
            {
                sb.AppendLine(string.Format("       {0}: {{", action.Name.FirstCharacterToLower()));

                string method = null;

                if (action.GetCustomAttributes(urlsInfo.GetAttributeType).Any())
                {
                    method = "get";
                }
                else if (action.GetCustomAttributes(urlsInfo.PostAttributeType).Any())
                {
                    method = "post";
                }
                else if (action.GetCustomAttributes(urlsInfo.PutAttributeType).Any())
                {
                    method = "put";
                }
                else if (action.GetCustomAttributes(urlsInfo.DeleteAttributeType).Any())
                {
                    method = "delete";
                }

                sb.AppendLine(string.Format("           method: '{0}',", method));
                sb.AppendLine(string.Format("           url: '{0}',", getUrlFunc(controllerName, action.Name, action.DeclaringType)));

                sb.AppendLine("       },");
            }

            return sb.ToString().TrimEnd().TrimEnd(',');
        }

        private string GetControllerArea(Type controllerType)
        {
            foreach (var areaType in this.areaTypes)
            {
                if (controllerType.Namespace.StartsWith(areaType.Namespace))
                {
                    var area = (AreaRegistration)Activator.CreateInstance(areaType);
                    return area.AreaName;
                }
            }

            return string.Empty;
        }
    }
}