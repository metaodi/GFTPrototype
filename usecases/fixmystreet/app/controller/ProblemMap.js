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
		
		// add problem marker to map
		me.addProblemMarkers(map);
    },
	
	addProblemMarkers: function(map) {
		var me = this;
		
		// custom marker image with shadow
		// - image created with: http://mapicons.nicolasmollet.com/
		// - shadow created with: http://www.cycloloco.com/shadowmaker/shadowmaker.htm
		var markerShadow = new google.maps.MarkerImage(
			'./resources/images/gmap-markers/shadow.png',
			// image size (after scaling)
			new google.maps.Size(49.0, 32.0),
			null,
			// image anchor to map in image (after scaling)
			new google.maps.Point(16.0, 32.0),
			// scale down image to half of the size to support retina displays
			new google.maps.Size(49.0, 32.0)
		);
		
		this.getProblemStore().each(function(record) {
			var data = record.getData();
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(data.latitude, data.longitude),
				map: map,
				icon: me.getProblemMarkerImages()[data.type.value],
				shadow: markerShadow,
				optimized: false
			});
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