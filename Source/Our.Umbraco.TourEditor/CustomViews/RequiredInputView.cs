namespace Our.Umbraco.TourEditor.CustomViews
{
    using Our.Umbraco.TourEditor.Interfaces;

    /// <summary>
    /// The required input view.
    /// </summary>   
    public class RequiredInputView : ICustomView
    {
        /// <summary>
        /// Gets the name.
        /// </summary>
        public string Name => "Required Input";

        /// <summary>
        /// Gets the view path.
        /// </summary>
        public string ViewPath => "/App_Plugins/TourEditor/backoffice/tours/views/requiredinput.html";
    }
}
