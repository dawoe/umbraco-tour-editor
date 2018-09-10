namespace Our.Umbraco.TourEditor.Interfaces
{
    /// <summary>
    /// The CustomView interface.
    /// </summary>
    public interface ICustomView
    {
        /// <summary>
        /// Gets the name.
        /// </summary>
        string Name { get;  }

        /// <summary>
        /// Gets the view path.
        /// </summary>
        string ViewPath { get;  }
    }
}
