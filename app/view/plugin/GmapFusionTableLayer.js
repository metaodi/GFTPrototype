Ext.ns('Ext.plugin.GMap');

Ext.define('Ext.plugin.GMap.FusionTableLayer', {
    extend: 'Ext.util.GeoLocation',
    alias : 'plugin.gmapfusiontablelayer',

    config: {
        host: null
    },

    /**
     * Initialize the plugin, binding to the host Ext.Map instance
     * @param {Ext.Map} host
     */
    init: function(host) {
        if (host && host.isMap === true) {
            this.setHost(host);
            host.setGeo(this);
        }
    },
	
	addLayer: function() {
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
		layer.setMap(this.getHost().getMap());
	}
	
});