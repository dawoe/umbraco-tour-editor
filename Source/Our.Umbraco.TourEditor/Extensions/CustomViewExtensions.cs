namespace Our.Umbraco.TourEditor.Extensions
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;

    using Our.Umbraco.TourEditor.Attributes;
    using Our.Umbraco.TourEditor.Interfaces;

    /// <summary>
    /// Custom view extensions.
    /// </summary>
    internal static class CustomViewExtensions
    {
        /// <summary>
        /// Gets all the custom properties assigned to the class
        /// </summary>
        /// <param name="view">
        /// The view.
        /// </param>
        /// <returns>
        /// The <see cref="List{T}"/>.
        /// </returns>
        public static List<CustomPropertyAttribute> GetCustomProperties(this ICustomView view)
        {           
            return view.GetType().GetCustomAttributes<CustomPropertyAttribute>().OrderBy(x => x.Order).ToList();            
        }
    }
}
