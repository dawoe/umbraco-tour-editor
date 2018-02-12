namespace Our.Umbraco.TourEditor.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Net.Http.Formatting;

    using global::Umbraco.Core.IO;
    using global::Umbraco.Web.Models;
    using global::Umbraco.Web.Models.Trees;
    using global::Umbraco.Web.Mvc;
    using global::Umbraco.Web.Trees;

    using umbraco.BusinessLogic.Actions;
    using global::Umbraco.Core.Services;

    using Our.Umbraco.TourEditor.Helpers;

    /// <summary>
    /// The tour editor tree controller.
    /// </summary>
    [Tree(global::Umbraco.Core.Constants.Applications.Settings, Constants.TreeAlias, "Tour files", sortOrder: 99)]
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
            var treeNodeCollection = new TreeNodeCollection();

            if (id == global::Umbraco.Core.Constants.System.Root.ToString())
            {
                // add tour files
                var result = new List<BackOfficeTourFile>();

                var coreToursPath = Path.Combine(IOHelper.MapPath(SystemDirectories.Config), "BackOfficeTours");
                if (Directory.Exists(coreToursPath))
                {
                    var tourHelper = new TourHelper();
                    foreach (var tourFile in Directory.EnumerateFiles(coreToursPath, "*.json"))
                    {
                        tourHelper.TryParseTourFile(tourFile, result);
                    }
                }

                foreach (var tour in result)
                {
                    var treeNode = this.CreateTreeNode(
                        tour.FileName,
                        id,
                        queryStrings,
                        tour.FileName,
                        "icon-slideshow",
                        false);

                    treeNodeCollection.Add(treeNode);
                }
            }

            return treeNodeCollection;
        }

        /// <summary>Returns the menu structure for the node</summary>
        /// <param name="id"></param>
        /// <param name="queryStrings"></param>
        /// <returns></returns>
        protected override MenuItemCollection GetMenuForNode(string id, FormDataCollection queryStrings)
        {
            var menuItemCollection = new MenuItemCollection();

            if (id == global::Umbraco.Core.Constants.System.Root.ToString())
            {
                menuItemCollection.Items.Add<ActionNew>(
                    this.Services.TextService.Localize($"actions/{ActionNew.Instance.Alias}"));

                menuItemCollection.Items.Add<RefreshNode, ActionRefresh>(
                    this.Services.TextService.Localize(string.Format("actions/{0}", ActionRefresh.Instance.Alias)),
                    true);

                menuItemCollection.DefaultMenuAlias = ActionNew.Instance.Alias;
            }
            else
            {
                menuItemCollection.Items.Add<ActionDelete>(
                    this.Services.TextService.Localize($"actions/{ActionDelete.Instance.Alias}"));
            }

            return menuItemCollection;
        }
    }
}
