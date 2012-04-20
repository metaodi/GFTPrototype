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
	
	requires: [
        'Ext.plugin.google.FusionTablesLayer',
        'Ext.plugin.google.Tracker'
	],
	
    models: [
		'Problem',
		'ProblemType'
    ],

    stores: [
		'ProblemTypes',
		'Problems'
    ],

    views: [
		'MainContainer',
		'MapNoCentering',
        'report.ReportContainer',
		'list.ListContainer'
    ],

    controllers: [
		'List',
		'Report'
    ],

	// launch function is called as soon as app is ready
    launch: function() {
		Ext.create('FixMyStreet.view.MainContainer');
    }
});
