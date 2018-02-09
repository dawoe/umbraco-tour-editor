namespace Our.Umbraco.TourEditor.Controllers
{
    using System.Net.Http.Formatting;

    using global::Umbraco.Web.Models.Trees;
    using global::Umbraco.Web.Mvc;
    using global::Umbraco.Web.Trees;

    /// <summary>
    /// The tour editor tree controller.
    /// </summary>
    [Tree(global::Umbraco.Core.Constants.Applications.Settings , Constants.TreeAlias, "Tour editor", sortOrder:99)]
    [PluginController(Constants.PluginName)]
    public class TourEditorTreeController : TreeController
    {
        /// <summary>
        /// The method called to render the contents of the tree structure
        /// </summary>
        /// <param name="id"></param>
        /// <param name="queryStrings">
        /// All of the query string parameters passed from jsTree
        /// </param>
        /// <remarks>
        /// We are allowing an arbitrary number of query strings to be pased in so that developers are able to persist custom data from the front-end
        /// to the back end to be used in the query for model data.
        /// </remarks>
        protected override TreeNodeCollection GetTreeNodes(string id, FormDataCollection queryStrings)
        {
            return new TreeNodeCollection();
        }

        /// <summary>Returns the menu structure for the node</summary>
        /// <param name="id"></param>
        /// <param name="queryStrings"></param>
        /// <returns></returns>
        protected override MenuItemCollection GetMenuForNode(string id, FormDataCollection queryStrings)
        {
            return new MenuItemCollection();
        }
    }
}
