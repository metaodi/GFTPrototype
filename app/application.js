/**
 * This file sets up the Traildevils application. We register an application called 'traildevils'.
 * This automatically sets up a global variable with the same name and the following namespaces:
 * - traildevils.controllers
 * - traildevils.views
 * 
 */ 

Ext.application({
    name: 'GFTPrototype',
	views: ['Main'],

	launch: function() {
		var mapView = Ext.create('GFTPrototype.view.Main');
		
		var layer = new google.maps.FusionTablesLayer({
			query: {
				select: 'Location',
				from: '3107027'
			},
			styles: [{
				polylineOptions: {
					strokeColor: "#rrggbb",
					strokeWeight: 2
				},
				markerOptions: {
					iconName: "falling_rocks"
				}
			}]

		});
		layer.setMap(mapView.map);
	}
});