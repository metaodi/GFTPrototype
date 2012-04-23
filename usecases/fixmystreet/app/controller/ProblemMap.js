Ext.define("FixMyStreet.controller.ProblemMap", {
	extend: "FixMyStreet.controller.Map",
	
	config: {
		views: [
			'map.ProblemMap',
			'map.MapContainer'
		],
		refs: {
			problemMap: '#problemMap',
			problemCurrentLocationButton: '#problemCurrentLocationButton',
			mainTabPanel: '#mainTabPanel'
		},
		control: {
			problemMap: {
				maprender: 'onMapRender'
			},
			problemCurrentLocationButton: {
				tap: 'onCurrentLocationButtonTap'
			},
			mainTabPanel: {
				activeitemchange: 'onTabPanelActiveItemChange'
			}
		}
	},
	onTabPanelActiveItemChange: function(tapPanelComp, value, oldValue, eOpts) {
		if(value.getId() == 'mapContainer') {
			this.refreshView();
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
			
			// add marker to problem markers array
			me.getProblemMarkers().push(marker);
		});
	},
	
	/**
     * Removes all markers from map
     * @private
     */
	removeProblemMarkers: function() {
		var markers = this.getProblemMarkers();
		for(var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
		markers = [];
	},
	
	onCurrentLocationButtonTap: function(button, e, eOpts) {
		var me = this;
		var map = me.getProblemMap();
		
		var latlng = me.getCurrentLocationLatLng(map.getGeo());
		map.setMapCenter(latlng);
	},
	
	refreshView: function () {
		var me = this;
		
		// if map is already rendered
		if(me.getMapRendered()) {
			me.removeProblemMarkers();
			me.addProblemMarkers(me.getProblemMap().getMap());
		}
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
    },
	
	getProblemMarkers: function() {
		return this.problemMarkers;
	},
	setProblemMarkers: function(problemMarkers) {
		this.problemMarkers = problemMarkers;
	}
});