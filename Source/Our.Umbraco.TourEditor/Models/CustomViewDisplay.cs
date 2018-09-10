namespace Our.Umbraco.TourEditor.Models
{
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    /// <summary>
    /// The custom view display model
    /// </summary>
    [DataContract(Name = "customView")]
    internal class CustomViewDisplay
    {
        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        [DataMember(Name = "name")]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the view path.
        /// </summary>
        [DataMember(Name = "viewPath")]
        public string ViewPath { get; set; }

        /// <summary>
        /// Gets or sets the properties.
        /// </summary>
        [DataMember(Name = "customProperties")]
        public List<CustomPropertyDisplay> Properties { get; set; }
    }
}
