namespace Our.Umbraco.TourEditor.ObjectResolution
{
    using System.Collections.Generic;
    using System.Reflection;

    using global::Umbraco.Core;

    using Our.Umbraco.TourEditor.Attributes;

    /// <summary>
    /// The plugin manager extensions.
    /// </summary>
    internal static class PluginManagerExtensions
    {
        /// <summary>
        /// Resolves classes attributed with customview attribute
        /// </summary>
        /// <param name="pluginmanager">
        /// The pluginmanager.
        /// </param>
        /// <returns>
        /// The <see cref="IEnumerable"/>.
        /// </returns>
        internal static IEnumerable<System.Type> ResolveCustomViews(this PluginManager pluginmanager)
        {
            var assembly = Assembly.Load("Our.Umbraco.TourEditor");
            return pluginmanager.ResolveAttributedTypes<CustomViewAttribute>(specificAssemblies: new List<Assembly> { assembly });
        }
    }
}
