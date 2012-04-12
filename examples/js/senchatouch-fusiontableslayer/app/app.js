/**
 * This file sets up the Traildevils application. We register an application called 'traildevils'.
 * This automatically sets up a global variable with the same name and the following namespaces:
 * - traildevils.controllers
 * - traildevils.views
 * 
 */ 

Ext.Loader.setPath({
    'GFTPrototype': 'app'
});

Ext.application({
    name: 'GFTPrototype',
	controllers: ['Map'],
	views: ['Main'],

	launch: function() {
		Ext.create('GFTPrototype.view.Main');
	}
});