Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    name: 'FusionTrack',
	
    models: [
		
    ],

    stores: [
        
    ],

    views: [
        
    ],

    controllers: [
		
    ],

    launch: function() {
        Ext.create('FusionTrack.view.Viewport', {fullscreen: true});
    }
});
