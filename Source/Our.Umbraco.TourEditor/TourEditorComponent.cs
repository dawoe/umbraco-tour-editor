using Our.Umbraco.TourEditor.Controllers;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Umbraco.Core.Composing;
using Umbraco.Web;
using Umbraco.Web.JavaScript;
using Umbraco.Web.Models;

namespace Our.Umbraco.TourEditor
{
    public class TourEditorComponent : IComponent
	{
		public void Initialize()
		{
            ServerVariablesParser.Parsing += ServerVariablesParserParsing;
        }

		public void Terminate()
		{
			
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
