namespace Our.Umbraco.TourEditor.Resolvers
{
    using System.Collections.Generic;

    using global::Umbraco.Core.ObjectResolution;

    using Our.Umbraco.TourEditor.Interfaces;

    /// <summary>
    /// The custom view resolver.
    /// </summary>
    public class CustomViewResolver : ManyObjectsResolverBase<CustomViewResolver, ICustomView>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CustomViewResolver"/> class.
        /// </summary>
        /// <param name="parsers">
        /// The parsers.
        /// </param>
        protected CustomViewResolver(IEnumerable<System.Type> parsers)
            : base(parsers, ObjectLifetimeScope.Application)
        {
        }

        public IEnumerable<ICustomView> CustomViews => this.Values;
    }
}
