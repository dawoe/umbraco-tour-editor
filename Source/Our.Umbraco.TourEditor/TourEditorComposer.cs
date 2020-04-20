using Umbraco.Core;
using Umbraco.Core.Composing;

namespace Our.Umbraco.TourEditor
{
    public class TourEditorComposer: IUserComposer
	{
        public void Compose(Composition composition)
        {
            composition.Components().Append<TourEditorComponent>();
        }
    }
}
