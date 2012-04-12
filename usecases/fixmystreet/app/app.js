Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    name: 'FixMyStreet',
	
    models: [
		
    ],

    stores: [
        
    ],

    views: [
        
    ],

    controllers: [
		
    ],

    launch: function() {
        Ext.create('FixMyStreet.view.Viewport', {fullscreen: true});
    }
});
