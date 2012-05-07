Ext.define('FixMyStreet.view.MapNoCenter', {
	extend: 'Ext.Map',
	alias: 'widget.mapnocenter',
	
	config: {
		mapOptions: {
			// set default center to zurich
			center: new google.maps.LatLng(FixMyStreet.util.Config.getMap().lat, FixMyStreet.util.Config.getMap().lng),
			zoom: FixMyStreet.util.Config.getMap().defaultZoom,
			disableDefaultUI: true,
			// enable map type control
			mapTypeControl: true,
			// enable zoom control
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			}
		}
	},
	
	/**
	 * OVERRIDEN SENCHA TOUCH FUNCTION
	 * CHANGE: don't center map on geo update event
	 */
	onGeoUpdate: function(geo) {
		var me = this;
		if (geo) {
            var map = me.getMap();
            var gm = (window.google || {}).maps;
			
			if (gm) {
				if (!me.isPainted()) {
					me.un('painted', 'onGeoUpdate', this);
					me.on('painted', 'onGeoUpdate', this, { delay: 50, single: true, args: [geo] });
					return;
				}
				
				if (!map) {
					me.renderMap();
				}
			}
        }
	}
});