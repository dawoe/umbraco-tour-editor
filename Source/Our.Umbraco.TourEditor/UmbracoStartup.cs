namespace Our.Umbraco.TourEditor
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Routing;

    using global::Umbraco.Core;
    using global::Umbraco.Web;
    using global::Umbraco.Web.UI.JavaScript;

    using Our.Umbraco.TourEditor.Controllers;

    /// <summary>
    /// The umbraco startup event handler
    /// </summary>
    internal class UmbracoStartup : ApplicationEventHandler
    {
        /// <summary>
        /// Overridable method to execute when All resolvers have been initialized but resolution is not frozen so they can be modified in this method
        /// </summary>
        /// <param name="umbracoApplication"></param>
        /// <param name="applicationContext"></param>
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
            
            if (!e.Keys.Contains("Our.Umbraco.TourEditor"))
            {
                e.Add("Our.Umbraco.TourEditor", urlDictionairy);
            }
        }
    }
}
