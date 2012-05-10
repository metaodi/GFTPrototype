Ext.define('FixMyStreet.view.map.LayerSegmentedButton', {
	extend: 'Ext.SegmentedButton',
	alias: 'widget.layersegmentedbutton',
	
	config: {
		id: 'layerSegementedButton',
		
		items: [
			{
				id: 'markerLayerButton',
				iconCls: 'marker',
				text: 'Marker',
				iconMask: true,
				width: '50%',
				pressed: true
			},
			{
				id: 'heatmapLayerButton',
				iconCls: 'hot',
				text: 'Heatmap',
				iconMask: true,
				width: '50%'
			}
		]
	}
});