namespace Our.Umbraco.TourEditor.Controllers
{
    using System.Collections.Generic;
    using System.IO;
    using System.Net.Http.Formatting;

    using global::Umbraco.Core.IO;
    using global::Umbraco.Web.Models;
    using global::Umbraco.Web.Models.Trees;
    using global::Umbraco.Web.Mvc;
    using global::Umbraco.Web.Trees;

    using global::Umbraco.Core.Services;

    using Our.Umbraco.TourEditor.Helpers;
    using global::Umbraco.Web.Actions;

    /// <summary>
    /// The tour editor tree controller.
    /// </summary>
    [Tree(global::Umbraco.Core.Constants.Applications.Settings, Constants.TreeAlias)]
    [PluginController(Constants.PluginName)]
    public class TourEditorTreeController : TreeController
    {
        /// <inheritdoc />
        protected override TreeNodeCollection GetTreeNodes(string id, FormDataCollection queryStrings)
        {
            var treeNodeCollection = new TreeNodeCollection();

            if (id == global::Umbraco.Core.Constants.System.Root.ToString())
            {
                // add tour files
                var result = this.GetTourFirles();

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
        
        /// <inheritdoc />
        protected override MenuItemCollection GetMenuForNode(string id, FormDataCollection queryStrings)
        {
            var menuItemCollection = new MenuItemCollection();

            if (id == global::Umbraco.Core.Constants.System.Root.ToString())
            {
                menuItemCollection.Items.Add<ActionNew>(
                    this.Services.TextService.Localize($"actions/{ActionNew.ActionAlias}"));

                var uploadMenuItem = new MenuItem("upload", "Upload") { Icon = "cloud-upload" };
                menuItemCollection.Items.Add(uploadMenuItem);

                menuItemCollection.Items.Add(new RefreshNode(Services.TextService, true));
                //menuItemCollection.Items.Add<RefreshNode, Actionf>(
                //    this.Services.TextService.Localize(string.Format("actions/{0}", ActionRefresh.Instance.Alias)),
                //    true);               
            }
            else
            {
                menuItemCollection.Items.Add<ActionDelete>(
                    this.Services.TextService.Localize($"actions/{ActionDelete.ActionAlias}"));
            }

            return menuItemCollection;
        }

        /// <summary>
        /// Gets all the tourfiles
        /// </summary>
        /// <returns>
        /// The <see cref="List{T}"/>.
        /// </returns>
        private List<BackOfficeTourFile> GetTourFirles()
        {
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

            return result;
        }
    }
}
