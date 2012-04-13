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
		"MainContainer",
        "ReportContainer"
    ],

    controllers: [
		"Map"
    ],

	// launch function is called as soon as app is ready
    launch: function() {
        Ext.create('FixMyStreet.view.MainContainer');
    }
});
