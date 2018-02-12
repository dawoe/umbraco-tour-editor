namespace Our.Umbraco.TourEditor.Helpers
{
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;

    using global::Umbraco.Web.Models;

    using Newtonsoft.Json;

    /// <summary>
    /// The tour helper.
    /// </summary>
    internal class TourHelper
    {
        public void TryParseTourFile(string tourFile, ICollection<BackOfficeTourFile> result)
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
