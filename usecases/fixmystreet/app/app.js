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
		'FixMyStreet.proxy.FusionTables',
		'FixMyStreet.plugin.PullRefresh'
	],
	
    models: [
		'Problem',
		'Type',
		'Status',
		'UserId'
    ],
	
    stores: [
		'Types',
		'Problems',
		'Status',
		'UserId'
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
		//defined logger (needed for production code)
		Ext.applyIf(Ext, {
			Logger: {
				log: Ext.emptyFn,
				setEnabled: Ext.emptyFn
			}
		});
		//un-comment to disable Logger
		//Ext.Logger.setEnabled(false);
		
		// load static data from stores
		Ext.getStore('Status').load();
		Ext.getStore('Types').load();
		
		// user id
		var userIdStore = Ext.getStore('UserId');
		userIdStore.load(function(records, operation, success) {
			if(records.length == 0) {
				// generating userid
				var userIdModel = Ext.create('FixMyStreet.model.UserId');
				userIdStore.add(userIdModel);
			}
			var userId = userIdStore.first().getId();
			FixMyStreet.util.Config.setUserId(userId);
			
			var problemStore = Ext.getStore('Problems');
			// model is loaded before user id store
			// -> update proxy condition with correct userid
			problemStore.getProxy().config.settings.condition = "userid = '" + userId + "'";
			problemStore.load();
		}, this);
		
		// get current geolocation
		FixMyStreet.geo = Ext.create('FixMyStreet.util.Geolocation');
		FixMyStreet.gftLib = new GftLib();
		FixMyStreet.geo.updateLocation(function() {
			Ext.create('FixMyStreet.view.MainContainer');
			FixMyStreet.geo.setAutoUpdate(true);
		});
    }
});
