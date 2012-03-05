/*
 * @class GFTPrototype.view.Map
 * @extends Ext.Container
 *
 * The viewport is the application's shell - the parts of the UI that don't change. In the Twitter app, we only ever
 * render a single view at a time, so we use a fullscreen card layout here. The other part of the UI is the search list
 * on the left, which we add as a docked item.
 */
Ext.define('GFTPrototype.view.Map', {
    extend: 'Ext.Map',
    xtype: 'gftmap',
	
    config: {
        mapOptions : {
			center : new google.maps.LatLng(50.85, 9.7),
			zoom: 5,
			mapTypeId : google.maps.MapTypeId.ROADMAP,
			navigationControl: true,
			navigationControlOptions: {
				style: google.maps.NavigationControlStyle.DEFAULT
			}
		},
		listeners: {
			maprender: function(comp, map) {
				var layer = new google.maps.FusionTablesLayer({
					query: {
						select: 'Location',
						from: '2741123'
					}
				});
				layer.setMap(map);
				
			}
		}
    }
});