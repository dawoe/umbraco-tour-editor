namespace Our.Umbraco.TourEditor.Attributes
{
    using System;

    /// <summary>
    /// Custom property attribute. Use this to mark your properties as a custom property
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public class CustomPropertyAttribute : Attribute
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CustomPropertyAttribute"/> class.
        /// </summary>
        /// <param name="propertyName">
        /// The property name.
        /// </param>
        /// <param name="label">
        /// The label.
        /// </param>
        /// <param name="order">
        /// The order.
        /// </param>
        /// <param name="view">
        /// The view.
        /// </param>
        /// <param name="viewConfig">
        /// The view config.
        /// </param>
        /// <param name="description">
        /// The description.
        /// </param>
        public CustomPropertyAttribute(string propertyName, string label, int order, string view = "textbox", string viewConfig = "", string description = "")
        {
            this.PropertyName = propertyName;
            this.Label = label;
            this.Order = order;
            this.View = view;
            this.ViewConfig = viewConfig;
            this.Description = description;
        }

        /// <summary>
        /// Gets or sets the name used in the json object
        /// </summary>
        public string PropertyName { get; set; }

        /// <summary>
        /// Gets or sets the label used in the backend
        /// </summary>
        public string Label { get; set; }

        /// <summary>
        /// Gets or sets the description used in the backend
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the angular view.
        /// </summary>
        public string View { get; set; }

        /// <summary>
        /// Gets or sets the config for the angular view
        /// </summary>
        public string ViewConfig { get; set; }

        /// <summary>
        /// Gets or sets the order.
        /// </summary>
        public int Order { get; set; }
    }
}
