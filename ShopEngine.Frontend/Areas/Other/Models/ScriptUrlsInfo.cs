using System;

namespace ShopEngine.Frontend.Areas.Other.Models
{
    public class ScriptUrlsInfo
    {
        public string JsObjectName { get; set; }

        public UrlRequestType UrlType { get; set; }

        public Type ControllerType { get; set; }

        public Type GetAttributeType { get; set; }

        public Type PostAttributeType { get; set; }

        public Type PutAttributeType { get; set; }

        public Type DeleteAttributeType { get; set; }

        public Type NonActionAttributeType { get; set; }
    }

    public enum UrlRequestType
    {
        Web,
        Ajax
    }
}