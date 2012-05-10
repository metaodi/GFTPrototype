Ext.define('FixMyStreet.view.map.MapContainer', {
	extend: 'Ext.Container',
	alias: 'widget.mapcontainer',
	
	config: {
		title: 'Übersicht',
		url: 'map',
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
						id: 'filterPopupButton',
						iconCls: 'settings',
						iconMask: true,
						align: 'left'
					},
					{
						xtype: 'segmentedbutton',
						id: 'layerSegementedButton',
						allowDepress: false,
						align: 'left',
						
						items: [
							{
								id: 'markerLayerButton',
								iconCls: 'marker',
								iconMask: true,
								pressed: true
							},
							{
								id: 'heatmapLayerButton',
								iconCls: 'hot',
								iconMask: true
							}
						]
					},
					{
						iconCls: 'locate',
						iconMask: true,
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