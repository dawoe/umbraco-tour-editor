namespace Our.Umbraco.TourEditor.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net.Http.Formatting;

    using global::Umbraco.Core.IO;
    using global::Umbraco.Web.Models;
    using global::Umbraco.Web.Models.Trees;
    using global::Umbraco.Web.Mvc;
    using global::Umbraco.Web.Trees;

    using Newtonsoft.Json;

    using umbraco.BusinessLogic.Actions;
    using global::Umbraco.Core.Services;

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
                    foreach (var tourFile in Directory.EnumerateFiles(coreToursPath, "*.json"))
                    {
                        this.TryParseTourFile(tourFile, result);
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

                menuItemCollection.Items.Add<RefreshNode, ActionRefresh>(this.Services.TextService.Localize(string.Format("actions/{0}", ActionRefresh.Instance.Alias)), true);

                menuItemCollection.DefaultMenuAlias = ActionNew.Instance.Alias;
            }

            return menuItemCollection;
        }

        /// <summary>
        /// Tries to parse the tour file contents and add's to the result collection
        /// </summary>
        /// <param name="tourFile">
        /// The tour file.
        /// </param>
        /// <param name="result">
        /// The result.
        /// </param>
        /// <exception cref="IOException">
        /// </exception>
        /// <exception cref="JsonReaderException">
        /// </exception>
        private void TryParseTourFile(string tourFile, ICollection<BackOfficeTourFile> result)
        {
            var fileName = Path.GetFileNameWithoutExtension(tourFile);
            if (fileName == null) return;


            try
            {
                var contents = File.ReadAllText(tourFile);
                var tours = JsonConvert.DeserializeObject<BackOfficeTour[]>(contents);

                var tour = new BackOfficeTourFile
                {
                    FileName = Path.GetFileNameWithoutExtension(tourFile),
                    PluginName = string.Empty,
                    Tours = tours.ToArray()
                };

                result.Add(tour);
            }
            catch (IOException e)
            {
                throw new IOException("Error while trying to read file: " + tourFile, e);
            }
            catch (JsonReaderException e)
            {
                throw new JsonReaderException("Error while trying to parse content as tour data: " + tourFile, e);
            }
        }
    }
}
