// enable Ext autoloader
Ext.Loader.setConfig({
    enabled: true
});

// LOCALIZATION
Ext.override(Ext.MessageBox, {
	statics: {
        YES   : {text: 'Ja',    itemId: 'yes', ui: 'action'},
        NO    : {text: 'Nein',     itemId: 'no'},
        CANCEL: {text: 'Abbrechen', itemId: 'cancel'},

        OKCANCEL: [
            {text: 'Abbrechen', itemId: 'cancel'},
        ],
        YESNOCANCEL: [
            {text: 'Abbrechen', itemId: 'cancel'},
            {text: 'Nein',     itemId: 'no'},
            {text: 'Ja',    itemId: 'yes', ui: 'action'}
        ],
        YESNO: [
            {text: 'Ja', itemId: 'yes', ui: 'action'},
			{text: 'Nein',  itemId: 'no'}
        ]
    }
});

Ext.application({
    name: 'FixMyStreet',
	icon: './resources/images/fixmystreet-icon.png',
	phoneStartupScreen: './resources/images/fixmystreet-startup_phone.png',
	statusBarStyle: 'black',
	viewport: {
		// hide navigation bar of browser
		autoMaximize: true
	},
	
	requires: [
		'FixMyStreet.util.Config',
		'FixMyStreet.util.Geolocation',
		'Ext.plugin.uxtouch.ListOptions',
		'Ext.plugin.uxtouch.FixListOptions'
	],
	
    models: [
		'Problem',
		'ProblemType',
		'Status'
    ],
	
    stores: [
		'ProblemTypes',
		'Problems',
		'Statuses'
    ],
	
    views: [
		'MainContainer',
		'MapNoCenter'
    ],
	
    controllers: [
		'List',
		'ReportMap',
		'ProblemMap'
    ],

	// launch function is called as soon as app is ready
    launch: function() {
		// get current geolocation
		FixMyStreet.geo = new FixMyStreet.util.Geolocation();
		FixMyStreet.gftLib = new GftLib();
		FixMyStreet.geo.updateLocation(function() {
			Ext.create('FixMyStreet.view.MainContainer');
			FixMyStreet.geo.setAutoUpdate(true);
		});
    }
});
