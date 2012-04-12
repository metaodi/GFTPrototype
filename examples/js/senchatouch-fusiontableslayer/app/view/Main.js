/**
 * The viewport is the application's shell - the parts of the UI that don't change. In the Twitter app, we only ever
 * render a single view at a time, so we use a fullscreen card layout here. The other part of the UI is the search list
 * on the left, which we add as a docked item.
 */
Ext.define('GFTPrototype.view.Main', {
    extend: 'Ext.Container',
    xtype: 'mainview',
	
	requires: ['GFTPrototype.view.Map'],
    
    config: {
        fullscreen: true,
        layout: 'card',
        items: [
            {
                xtype: 'gftmap'
            }
        ]
    }
});