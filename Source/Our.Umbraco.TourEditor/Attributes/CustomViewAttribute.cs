namespace Our.Umbraco.TourEditor.Attributes
{
    using System;

    /// <summary>
    /// Custom view attribute
    /// </summary>
    [AttributeUsage(AttributeTargets.Class)]
    public class CustomViewAttribute : Attribute
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CustomViewAttribute"/> class.
        /// </summary>
        /// <param name="name">
        /// The name.
        /// </param>
        /// <param name="viewPath">
        /// The view  path.
        /// </param>
        public CustomViewAttribute(string name, string viewPath)
        {
            this.Name = name;
            this.ViewPath = viewPath;
        }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the view path.
        /// </summary>
        public string ViewPath { get; set; }
    }
}
