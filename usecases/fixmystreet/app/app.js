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
	startupImage: {
		// Non-retina iPhone, iPod touch, and all Android devices
		'320x460': 'resources/startup/fixmystreet-startup-320x460.jpg',
		// Retina iPhone and iPod touch
		'640x920': './resources/images/fixmystreet-startup-640x920.png'
	},
	
	statusBarStyle: 'black',
	viewport: {
		// hide navigation bar of browser
		autoMaximize: true
	},
	
	requires: [
		'FixMyStreet.util.Config',
		'FixMyStreet.util.Geolocation',
		'Ext.plugin.uxtouch.ListOptions',
		'Ext.plugin.uxtouch.FixListOptions',
		'FixMyStreet.proxy.FusionTables'
	],
	
    models: [
		'Problem',
		'Type',
		'Status'
    ],
	
    stores: [
		'Types',
		'Problems',
		'Status'
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
		// load static data from stores
		Ext.getStore('Status').load();
		Ext.getStore('Types').load();
		
		// get current geolocation
		FixMyStreet.geo = new FixMyStreet.util.Geolocation();
		FixMyStreet.gftLib = new GftLib();
		FixMyStreet.geo.updateLocation(function() {
			Ext.create('FixMyStreet.view.MainContainer');
			FixMyStreet.geo.setAutoUpdate(true);
		});
    }
});
