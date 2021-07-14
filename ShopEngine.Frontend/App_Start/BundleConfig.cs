using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Optimization;
using System.Linq;

namespace ShopEngine.Frontend
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/libs").IncludeDirectory("~/Content/libs", "*.js"));
            bundles.Add(new ScriptBundle("~/bundles/pluginsJs").IncludeDirectory("~/Content/plugins", "*.js", true));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/bundles/pluginsCss").IncludeDirectory("~/Content/plugins", "*.css", true));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            bundles.Add(GetTypeScriptCompatibleBundle("~/bundles/core", "core"));
            bundles.Add(GetTypeScriptCompatibleBundle("~/bundles/custom", "app"));
        }

        /// <summary>
        /// Allows to debug JS files on fly without compilation.
        /// Typescript files compiled on save and used from Scripts_built folder in case of DEBUG mode.
        /// </summary>
        /// <param name="virtualPath">Bundle virtual path</param>
        /// <param name="physicalDirectoryPath">Physical path</param>
        /// <returns>Bundle object</returns>
        private static Bundle GetTypeScriptCompatibleBundle(string virtualPath, string physicalDirectoryPath)
        {
#if DEBUG
            var scriptBundle = new ScriptBundle(virtualPath);

            scriptBundle.Orderer = new BundleOrderer();
            scriptBundle.IncludeDirectory("~/Scripts_built/" + physicalDirectoryPath, "*.js", true);

            string baseFolderPath = HttpContext.Current.Server.MapPath("~/");
            string scriptsPath = Path.Combine(baseFolderPath, "Scripts_built");
            string typeScriptFilesPath = Path.Combine(scriptsPath, physicalDirectoryPath.Replace('/', Path.DirectorySeparatorChar));

            foreach (string typeScriptFile in Directory.GetFiles(typeScriptFilesPath, "*.ts", SearchOption.AllDirectories))
            {
                string relativeTsFilePath = typeScriptFile.Substring(scriptsPath.Length);
                string compiledTsFilePath = "~/Scripts_built/" + Path.ChangeExtension(relativeTsFilePath, "js").Replace(Path.DirectorySeparatorChar, '/');

                scriptBundle.Include(compiledTsFilePath);
            }

            return scriptBundle;
#else
            return new ScriptBundle(virtualPath).IncludeDirectory("~/Scripts_built/" + physicalDirectoryPath, "*.js", true);
#endif
        }

        public class BundleOrderer : IBundleOrderer
        {
            public IEnumerable<BundleFile> OrderFiles(BundleContext context, IEnumerable<BundleFile> files)
            {
                string basePath = "/scripts_built/core";
                string appJsFileName = basePath + "/app.js";
                var appJs = files.FirstOrDefault(x => x.VirtualFile.VirtualPath.ToLower() == appJsFileName);

                if (appJs != null)
                {
                    yield return appJs;
                }

                files = files.Where(x =>
                {
                    var path = x.VirtualFile.VirtualPath.ToLower();
                    return path != appJsFileName && !path.Contains(".def.");
                });

                var otherFiles = new List<BundleFile>();

                foreach (var file in files)
                {
                    var path = file.VirtualFile.VirtualPath.ToLower();
                    if ( path.StartsWith(basePath + "/modules"))
                    {
                        yield return file;
                    }
                    else
                    {
                        otherFiles.Add(file);
                    }
                }

                foreach (var file in otherFiles)
                {
                    yield return file;
                }
            }
        }
    }
}
