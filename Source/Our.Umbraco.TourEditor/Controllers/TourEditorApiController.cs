namespace Our.Umbraco.TourEditor.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    using global::Umbraco.Core.IO;
    using global::Umbraco.Core.Logging;
    using global::Umbraco.Core.Persistence.Migrations.Upgrades.TargetVersionSevenSixZero;
    using global::Umbraco.Web.Editors;
    using global::Umbraco.Web.Models;
    using global::Umbraco.Web.Mvc;
    using global::Umbraco.Web.WebApi;

    using Newtonsoft.Json;

    using Our.Umbraco.TourEditor.Helpers;
    using Our.Umbraco.TourEditor.Resolvers;

    /// <summary>
    /// The tour editor api controller.
    /// </summary>
    [PluginController(Constants.PluginName)]
    public class TourEditorApiController : BackOfficeNotificationsController
    {
        /// <summary>
        /// Creates a new tour file
        /// </summary>
        /// <param name="filename">
        /// The filename.
        /// </param>
        /// <returns>
        /// The <see cref="HttpResponseMessage"/>.
        /// </returns>
        [HttpPost]
        public HttpResponseMessage CreateTourFile(string filename)
        {
            // filename may not empty
            if (string.IsNullOrEmpty(filename))
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

            // can not contain invalid chars
            if (filename.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0)
            {
                return this.Request.CreateNotificationValidationErrorResponse("File name contains invalid characters");
            }

            var toursFolder = Path.Combine(IOHelper.MapPath(SystemDirectories.Config), "BackOfficeTours");


            // file should not exist
            var filePath = Path.Combine(toursFolder, filename + ".json");
            if (File.Exists(filePath))
            {
                return this.Request.CreateNotificationValidationErrorResponse("A file with this name already exists");
            }

            try
            {
                var content = JsonConvert.SerializeObject(new BackOfficeTour[0]);

                File.WriteAllText(filePath, content);

                return this.Request.CreateNotificationSuccessResponse("Tour file created succesfully");
            }
            catch (Exception e)
            {
                this.Logger.Error<TourEditorApiController>("Error creating tour file", e);
                return this.Request.CreateNotificationValidationErrorResponse("Error creating tour file");
            }
        }

        [HttpPost]
        [HttpDelete]
        public HttpResponseMessage DeleteTourFile(string filename)
        {
            // filename may not empty
            if (string.IsNullOrEmpty(filename))
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

            // can not contain invalid chars
            if (filename.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0)
            {
                return this.Request.CreateNotificationValidationErrorResponse("File name contains invalid characters");
            }

            var toursFolder = Path.Combine(IOHelper.MapPath(SystemDirectories.Config), "BackOfficeTours");


            // file should exist
            var filePath = Path.Combine(toursFolder, filename + ".json");
            if (!File.Exists(filePath))
            {
                return this.Request.CreateNotificationValidationErrorResponse("A file with this name does not exist");
            }

            try
            {
                File.Delete(filePath);

                return this.Request.CreateNotificationSuccessResponse("Tour file deleted succesfully");
            }
            catch (Exception e)
            {
                this.Logger.Error<TourEditorApiController>("Error deleting tour file", e);
                return this.Request.CreateNotificationValidationErrorResponse("Error deleting tour file");
            }
        }

        /// <summary>
        /// The get tours from file.
        /// </summary>
        /// <param name="filename">
        /// The filename.
        /// </param>
        /// <returns>
        /// The <see cref="HttpResponseMessage"/>.
        /// </returns>
        [HttpGet]
        public HttpResponseMessage GetTourFile(string filename)
        {
            // filename may not empty
            if (string.IsNullOrEmpty(filename))
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

            // can not contain invalid chars
            if (filename.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0)
            {
                return this.Request.CreateNotificationValidationErrorResponse("File name contains invalid characters");
            }

            var toursFolder = Path.Combine(IOHelper.MapPath(SystemDirectories.Config), "BackOfficeTours");


            // file should exist
            var filePath = Path.Combine(toursFolder, filename + ".json");
            if (!File.Exists(filePath))
            {
                return this.Request.CreateNotificationValidationErrorResponse("A file with this name does not exist");
            }

            try
            {
                var tourHelper = new TourHelper();

                var result = new List<BackOfficeTourFile>();

                tourHelper.TryParseTourFile(filePath, result);

                return this.Request.CreateResponse(HttpStatusCode.OK, result[0]);
            }
            catch (Exception e)
            {
                this.Logger.Error<TourEditorApiController>("Error loading tour file", e);
                return this.Request.CreateNotificationValidationErrorResponse("Error loading tour file");
            }
        }

        /// <summary>
        /// Saves the tour file
        /// </summary>
        /// <param name="tourfile">
        /// The tourfile.
        /// </param>
        /// <returns>
        /// The <see cref="HttpResponseMessage"/>.
        /// </returns>
        [HttpPost]
        public HttpResponseMessage SaveTourFile(BackOfficeTourFile tourfile)
        {
            // filename may not empty
            if (tourfile == null || string.IsNullOrEmpty(tourfile.FileName))
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

            // can not contain invalid chars
            if (tourfile.FileName.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0)
            {
                return this.Request.CreateNotificationValidationErrorResponse("File name contains invalid characters");
            }

            var toursFolder = Path.Combine(IOHelper.MapPath(SystemDirectories.Config), "BackOfficeTours");

            // file should exist
            var filePath = Path.Combine(toursFolder, tourfile.FileName + ".json");
            if (!File.Exists(filePath))
            {
                return this.Request.CreateNotificationValidationErrorResponse("A file with this name does not exist");
            }

            try
            {
                var content = JsonConvert.SerializeObject(tourfile.Tours, Formatting.Indented);

                File.WriteAllText(filePath, content);

                return this.Request.CreateNotificationSuccessResponse("Tour file saved succesfully");
            }
            catch (Exception e)
            {
                this.Logger.Error<TourEditorApiController>("Error saving tour file", e);
                return this.Request.CreateNotificationValidationErrorResponse("Error saving tour file");
            }
        }

        /// <summary>
        /// Get all aliases in tour, except those from current file
        /// </summary>
        /// <param name="filename">
        /// The filename.
        /// </param>
        /// <returns>
        /// The <see cref="HttpResponseMessage"/>.
        /// </returns>
        public HttpResponseMessage GetAliases(string filename)
        {
            // filename may not empty
            if (string.IsNullOrEmpty(filename))
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

            // can not contain invalid chars
            if (filename.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0)
            {
                return this.Request.CreateNotificationValidationErrorResponse("File name contains invalid characters");
            }

            var result = new List<BackOfficeTourFile>();

            var tourHelper = new TourHelper();


            // get core tours
            var coreToursPath = Path.Combine(IOHelper.MapPath(SystemDirectories.Config), "BackOfficeTours");

            if (Directory.Exists(coreToursPath))
            {
                foreach (var tourFile in Directory.EnumerateFiles(coreToursPath, "*.json"))
                {
                    if (Path.GetFileNameWithoutExtension(tourFile) != filename)
                    {
                        // if it's not current file we will get it
                        tourHelper.TryParseTourFile(tourFile, result);
                    }                  
                }
            }

            // get plugin tours
            foreach (var plugin in Directory.EnumerateDirectories(IOHelper.MapPath(SystemDirectories.AppPlugins)))
            {                                                
                foreach (var backofficeDir in Directory.EnumerateDirectories(plugin, "backoffice"))
                {
                    foreach (var tourDir in Directory.EnumerateDirectories(backofficeDir, "tours"))
                    {
                        foreach (var tourFile in Directory.EnumerateFiles(tourDir, "*.json"))
                        {
                            tourHelper.TryParseTourFile(tourFile, result);
                        }
                    }
                }
            }

            var aliases = new List<string>();

            foreach (var tourfile in result)
            {
                aliases.AddRange(tourfile.Tours.Select(x => x.Alias));
            }

            return this.Request.CreateResponse(HttpStatusCode.OK, aliases);
        }

        /// <summary>
        /// Get all groups in tours, except those from current file
        /// </summary>
        /// <param name="filename">
        /// The filename.
        /// </param>
        /// <returns>
        /// The <see cref="HttpResponseMessage"/>.
        /// </returns>
        public HttpResponseMessage GetGroups(string filename)
        {
            // filename may not empty
            if (string.IsNullOrEmpty(filename))
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

            // can not contain invalid chars
            if (filename.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0)
            {
                return this.Request.CreateNotificationValidationErrorResponse("File name contains invalid characters");
            }

            var result = new List<BackOfficeTourFile>();

            var tourHelper = new TourHelper();


            // get core tours
            var coreToursPath = Path.Combine(IOHelper.MapPath(SystemDirectories.Config), "BackOfficeTours");

            if (Directory.Exists(coreToursPath))
            {
                foreach (var tourFile in Directory.EnumerateFiles(coreToursPath, "*.json"))
                {
                    if (Path.GetFileNameWithoutExtension(tourFile) != filename)
                    {
                        // if it's not current file we will get it
                        tourHelper.TryParseTourFile(tourFile, result);
                    }
                }
            }

            // get plugin tours
            foreach (var plugin in Directory.EnumerateDirectories(IOHelper.MapPath(SystemDirectories.AppPlugins)))
            {
                foreach (var backofficeDir in Directory.EnumerateDirectories(plugin, "backoffice"))
                {
                    foreach (var tourDir in Directory.EnumerateDirectories(backofficeDir, "tours"))
                    {
                        foreach (var tourFile in Directory.EnumerateFiles(tourDir, "*.json"))
                        {
                            tourHelper.TryParseTourFile(tourFile, result);
                        }
                    }
                }
            }

            var groups = new List<string>();

            foreach (var tourfile in result)
            {
                groups.AddRange(tourfile.Tours.Select(x => x.Group));
            }

            return this.Request.CreateResponse(HttpStatusCode.OK, groups.Distinct());
        }

        /// <summary>
        /// The get cultures.
        /// </summary>
        /// <returns>
        /// The <see cref="HttpResponseMessage"/>.
        /// </returns>
        [HttpGet]
        public HttpResponseMessage GetCultures()
        {
            var languages = this.Services.TextService.GetSupportedCultures().ToDictionary(x => x.Name, x => x.DisplayName);

            return this.Request.CreateResponse(languages.ToList());
        }

        /// <summary>
        /// Getst the configured custom views
        /// </summary>
        /// <returns>
        /// The <see cref="HttpResponseMessage"/>.
        /// </returns>
        [HttpGet]
        public HttpResponseMessage GetCustomViews()
        {
            var customViews = CustomViewResolver.Current.CustomViews;

            return this.Request.CreateResponse(customViews.ToList());
        }
    }
}
