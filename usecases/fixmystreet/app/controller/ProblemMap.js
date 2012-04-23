Ext.define("FixMyStreet.controller.ProblemMap", {
	extend: "FixMyStreet.controller.Map",
	
	config: {
		views: [
			'map.ProblemMap',
			'map.MapContainer'
		],
		refs: {
			problemMap: '#problemMap',
			problemCurrentLocationButton: '#problemCurrentLocationButton'
		},
		control: {
			problemMap: {
				maprender: 'onMapRender'
			},
			problemCurrentLocationButton: {
				tap: 'onCurrentLocationButtonTap'
			}
		}
	},
	
	onMapRender: function(mapComp, map, eOpts) {
		var me = this;
        me.callParent(arguments);
		
		// add problem markers to map
		me.addProblemMarkers(map);
    },
	
	addProblemMarkers: function(map) {
		var me = this;
		
		this.getProblemStore().each(function(record) {
			var data = record.getData();
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(data.latitude, data.longitude),
				map: map,
				icon: me.getProblemMarkerImages()[data.type.value],
				shadow: me.getMarkerShadow(),
				// do not optimize marker image to recieve retina display support
				optimized: false
			});
			
			// add marker to problemmarkers array
			me.problemMarkers.push(marker);
		});
	},
	
	onCurrentLocationButtonTap: function(button, e, eOpts) {
		var me = this;
		var map = me.getProblemMap();
		
		var latlng = me.getCurrentLocationLatLng(map.getGeo());
		map.setMapCenter(latlng);
	},
	
	// -------------------------------------------------------
    // Base Class functions
	// -------------------------------------------------------
    launch: function () {
        this.callParent(arguments);
    },
    init: function () {
		var me = this;
        me.callParent(arguments);
		
		me.problemMarkers = [];
    }
});