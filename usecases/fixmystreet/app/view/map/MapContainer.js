Ext.define('FixMyStreet.view.map.MapContainer', {
	extend: 'Ext.Container',
	alias: 'widget.mapcontainer',
	
	config: {
		title: 'Karte',
		iconCls: 'maps',
		layout: 'fit',
		items: [
			{
				xtype: 'titlebar',
				cls: 'titlebar',
				docked: 'top',
				title: 'Defekte anzeigen'
			},
			{
				xtype: 'problemmap'
			}
		]
	}
});