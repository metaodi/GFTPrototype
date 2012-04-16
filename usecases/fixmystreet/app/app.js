// enable Ext autoloader
Ext.Loader.setConfig({
    enabled: true
});

// override MessageBox configuration
var ExtMessageBox = Ext.MessageBox;
Ext.apply(ExtMessageBox, {
	YES: {text : 'Ja', itemId : 'yes', ui : 'action' },
	NO: {text : 'Nein', itemId : 'no'}
});
Ext.apply(ExtMessageBox, {
    YESNO: [ExtMessageBox.YES, ExtMessageBox.NO]
});

Ext.application({
    name: 'FixMyStreet',
	icon: './resources/images/fixmystreet-icon.png',
	phoneStartupScreen: './resources/images/fixmystreet-startup_phone.png',
	statusBarStyle: 'black',
	
    models: [
		'ProblemType'
    ],

    stores: [
		'ProblemTypes'
    ],

    views: [
		'MainContainer',
        'ReportContainer'
    ],

    controllers: [
		'Map'
    ],

	// launch function is called as soon as app is ready
    launch: function() {
        Ext.create('FixMyStreet.view.MainContainer');
    }
});
