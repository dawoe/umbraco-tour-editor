# Easy custom view editing #

You can register your custom views with tour editor, so that the can be selected through the UI and the properties can be edited using a user friendly UI. This prevents your tour creators to remember the exact path of the view and json structure for the custom properties.

## Custom View class ##


To make a view selectable in the UI you will need to create a class that implements the interface ` Our.Umbraco.TourEditor.Interfaces.ICustomView`

This interface requires you to implement 2 properties

`Name`: this is the name that will be use in the dropdown for selecting custom views

`ViewPath` : this is the path of your custom view

## Custom Properties ##

Often you want to pass extra data to your view using custom properties. To make them easy editable you can decorate your custom view class with (multiple) `CustomProperty` attributes.

`CustomProperty` attribute has the following properties

`PropertyName` (required): the name of the property as used in the JSON object

`Label` (required) : the label used for the property in the UI

`Order` (required) : the order of the property in the UI

`Description` (optional) : the description of the property in the UI.

`View` (optional) : the view to use as the editor of the property. Defaults to textbox.

`ViewConfig` (optional) : the JSON config object to use for the editor of the property. Make sure that your properties in the object are surrounded by double quotes eg `ViewConfig =  "{ \"maxChars\" : 100 }"`

## Example custom view ##

    [CustomProperty("input", "Required input", 0, Description = "Enter the required input from the user")]
	public class CustomRequiredInput: ICustomView
	{
	    public string Name
	    {
	        get
	        {
	            return "Required Custom Input";
	        }
	    }
	
	    public string ViewPath
	    {
	        get
	        {
	            return "/App_Plugins/CustomSteps/requiredinput.html";
	        }
	    }
	}
    


    }


## Registering custom views ##

Registering your custom views  must be done in the `ApplicationStarting` event of a class inheriting from `Umbraco.Core.ApplicationEventHandler`

	public class UmbracoStartup : ApplicationEventHandler
    {
		protected override void ApplicationStarting(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
		{	
			           Our.Umbraco.TourEditor.Resolvers.CustomViewResolver.Current.AddType<CustomRequiredInput>();
						
		}
    }


## Removing built-in custom views ##

Removing your buil-in custom view  must be done in the `ApplicationStarting` event of a class inheriting from `Umbraco.Core.ApplicationEventHandler`

	public class UmbracoStartup : ApplicationEventHandler
    {
		protected override void ApplicationStarting(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
		{	
						Our.Umbraco.TourEditor.Resolvers.CustomViewResolver.Current.RemoveType<RequiredInputView>();
		}
    }
