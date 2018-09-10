namespace Our.Umbraco.TourEditor.Models
{
    using System.Runtime.Serialization;

    /// <summary>
    /// The custom property display model
    /// </summary>
    [DataContract(Name = "customProperty")]
    internal class CustomPropertyDisplay
    {
        /// <summary>
        /// Gets or sets the property.
        /// </summary>
        [DataMember(Name = "property")]
        public string Property { get; set; }

        /// <summary>
        /// Gets or sets the label.
        /// </summary>
        [DataMember(Name = "label")]
        public string Label { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        [DataMember(Name = "description")]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the view.
        /// </summary>
        [DataMember(Name = "view")]
        public string View { get; set; }

        /// <summary>
        /// Gets or sets the config.
        /// </summary>
        [DataMember(Name = "config")]
        public string Config { get; set; }
    }
}
