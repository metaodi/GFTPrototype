Ext.define('FixMyStreet.view.ReportContainer', {
	extend: 'Ext.Container',
	alias: 'widget.reportcontainer',

	config: {
		layout: 'vbox',
		items: [
			{
				xtype: 'selectfield',
				label: 'Defekt melden...',
				options: [
					{text: 'Strassenlampe',  value: 'first'},
					{text: 'Schlagloch', value: 'second'},
					{text: 'Littering',  value: 'third'}
				]
			},
			{
				xtype: 'map',
				id: 'gftmap',
				mapOptions: {
					zoom: 17
				},
				useCurrentLocation: true
			},
			{
				xtype: 'button',
				text: 'Jetzt melden',
				ui: 'action'
			}
		]
	}
	
});