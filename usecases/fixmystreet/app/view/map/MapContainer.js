Ext.define('FixMyStreet.view.map.MapContainer', {
	extend: 'Ext.Container',
	alias: 'widget.mapcontainer',
	
	config: {
		title: 'Übersicht',
		id: 'mapContainer',
		iconCls: 'maps',
		layout: 'fit',
		items: [
			{
				xtype: 'titlebar',
				cls: 'titlebar',
				docked: 'top',
				title: 'Defekte anzeigen',
				
				items: [
					{
						iconCls: 'settings',
						iconMask: 'true',
						align: 'left',
						id: 'filterPopupButton'
					},
					{
						iconCls: 'locate',
						iconMask: 'true',
						align: 'right',
						id: 'problemCurrentLocationButton'
					}
				]
			},
			{
				xtype: 'mapnocenter',
				id: 'problemMap'
			}
		]
	}
});