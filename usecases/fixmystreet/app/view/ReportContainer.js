Ext.define('FixMyStreet.view.ReportContainer', {
	extend: 'Ext.Container',
	alias: 'widget.reportcontainer',

	config: {
		title: 'Melden',
		iconCls: 'locate',
		layout: 'vbox',
		items: [
			{
				xtype: 'titlebar',
				cls: 'titlebar',
				docked: 'top',
				title: 'Defekt melden'
			},
			{
				xtype: 'selectfield',
				name: 'type',
				label: 'Defekttyp',
				options: [
					{text: 'Typ waehlen...',  value: 'undefined'},
					{text: 'Strassenlampe',  value: 'light'},
					{text: 'Schlagloch', value: 'bump'},
					{text: 'Littering',  value: 'littering'},
					{text: 'Eisglaette',  value: 'ice'}
				]
			},
			{
				xtype: 'map',
				id: 'gftmap',
				// fill the remaining space with the map
				flex: 1,
				mapOptions: {
					zoom: 17,
					streetViewControl: false,
					navigationControl: false
				},
				useCurrentLocation: true
			},
			{
				xtype: 'textfield',
				label: 'Adresse',
				name: 'address',
				disabled: true
			},
			{
				xtype: 'button',
				id: 'reportbutton',
				text: 'Jetzt melden',
				ui: 'action',
				disabled: true
			}
		]
	}
});