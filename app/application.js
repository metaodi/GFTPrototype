/**
 * This file sets up the Traildevils application. We register an application called 'traildevils'.
 * This automatically sets up a global variable with the same name and the following namespaces:
 * - traildevils.controllers
 * - traildevils.views
 * 
 */ 

Ext.application({
    name: 'GFTPrototype',
	views: ['Main'],

    launch: function() {
        Ext.create('GFTPrototype.view.Main');
    }
});