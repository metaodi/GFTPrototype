/*
 * This controller is the main, and only controller for this application. It handles all the views and functionality
 * of this application.
 */
Ext.define('GFTPrototype.controller.Map', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: {
                selector  : 'mainview',
                xtype     : 'mainview',
                autoCreate: true
            }
        }
	}
});