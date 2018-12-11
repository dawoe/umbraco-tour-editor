namespace Our.Umbraco.TourEditor
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Routing;

    using global::Umbraco.Core;
    using global::Umbraco.Web;
    using global::Umbraco.Web.Models;
    using global::Umbraco.Web.UI.JavaScript;

    using Our.Umbraco.TourEditor.Controllers;
    using Our.Umbraco.TourEditor.Extensions;
    using Our.Umbraco.TourEditor.Resolvers;

    /// <summary>
    /// The umbraco startup event handler
    /// </summary>
    internal class UmbracoStartup : ApplicationEventHandler
    {
        /// <inheritdoc />
        protected override void ApplicationInitialized(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            CustomViewResolver.Current =
                new CustomViewResolver(PluginManager.Current.ResolveCustomViews());
        }

        /// <inheritdoc />
        protected override void ApplicationStarting(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            // setup server variables
            ServerVariablesParser.Parsing += this.ServerVariablesParserParsing;
        }

        /// <summary>
        /// ServerVariablesParser parsing event handler
        /// </summary>
        /// <param name="sender">
        /// The sender.
        /// </param>
        /// <param name="e">
        /// The e.
        /// </param>
        private void ServerVariablesParserParsing(object sender, Dictionary<string, object> e)
        {
            if (HttpContext.Current == null)
            {
                return;
            }

            var urlHelper = new UrlHelper(new RequestContext(new HttpContextWrapper(HttpContext.Current), new RouteData()));

            var urlDictionairy = new Dictionary<string, object>();

            urlDictionairy.Add("TourEditorApi", urlHelper.GetUmbracoApiServiceBaseUrl<TourEditorApiController>(c => c.CreateTourFile(null)));

            var hasContentTypeProp = typeof(BackOfficeTour).GetProperty("ContentType") != null;

            urlDictionairy.Add("SupportsContentType", hasContentTypeProp);

            var hasCultureProp = typeof(BackOfficeTour).GetProperty("Culture") != null;

            urlDictionairy.Add("SupportsCulture", hasCultureProp);


            if (!e.Keys.Contains("Our.Umbraco.TourEditor"))
            {
                e.Add("Our.Umbraco.TourEditor", urlDictionairy);
            }
        }
    }
}
