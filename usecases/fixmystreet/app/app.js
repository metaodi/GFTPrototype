Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    name: 'FixMyStreet',
	icon: './resources/images/fixmystreet-icon.png',
	phoneStartupScreen: './resources/images/fixmystreet-startup_phone.png',
	statusBarStyle: 'black',
	
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
