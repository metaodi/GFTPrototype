Ext.define("FixMyStreet.controller.ProblemMap", {
	extend: "FixMyStreet.controller.Map",
	
	config: {
		views: [
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
		
		if(mapComp.getGeo() && !mapComp.getGeo().isAvailable()) {
			// if geolocation isn't available
			me.getProblemCurrentLocationButton().setDisabled(true);
		}
		
		// add problem markers to map
		me.addProblemMarkers(map);
    },
	
	addProblemMarkers: function(map) {
		var me = this;
		
		this.getProblemStore().each(function(record) {
			me.addProblemMarker(map, record);
		});
	},
	
	addProblemMarker: function(map, record) {
		var me = this;
		
		var data = record.getData();
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.latitude, data.longitude),
			map: map,
			icon: me.getProblemMarkerImages()[data.type.value],
			shadow: me.getMarkerShadow(),
			// do not optimize marker image to recieve retina display support
			optimized: false
		});
		
		marker.content =
			'<div class="infowindow-content">' +
				'<div class="trail-info">' +
					'<p class="date">' + new Timestamp(data.timestamp).getDate() + '</p>' +
					'<div class="image"><img src="./resources/images/problem-types/' + data.type.value + '.png" /></div>' +
					'<div class="info">' +
						'<h1>' + data.type.text + '</h1>' +
						'<p class="address">' + data.address + '</p>' +
					'</div>' +
				'</div>' +
			'</div>';
		
		marker.listener = google.maps.event.addListener(marker, 'click', function() {
			// this attribute references to the current marker
			me.getInfoWindow().setContent(this.content);
			me.getInfoWindow().open(map, this);
		});
		
		// add marker to problem markers array
		me.getProblemMarkers().push(marker);
	},
	
	/**
     * Removes all markers from map
     * @private
     */
	removeProblemMarkers: function() {
		var markers = this.getProblemMarkers();
		
		for(var i = 0; i < markers.length; i++) {
			if(markers[i].listener) {
				google.maps.event.removeListener(markers[i].listener);
			}
			markers[i].setMap(null);
		}
		markers = [];
	},
	
	onCurrentLocationButtonTap: function(button, e, eOpts) {
		var me = this;
		var map = me.getProblemMap();
		
		var latlng = me.getCurrentLocationLatLng(map);
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
		
		// create infowindow with maxWidth depending on trailsMap panelsize (all markers will use this infowindow)
		me.infoWindow = new google.maps.InfoWindow({
			// @TODO get width of parent map
			//maxWidth: this.getProblemMap().getSize().width - 50
		});
    },
	
	getProblemMarkers: function() {
		return this.problemMarkers;
	},
	setProblemMarkers: function(problemMarkers) {
		this.problemMarkers = problemMarkers;
	},
	getInfoWindow: function() {
		return this.infoWindow;
	},
	setInfoWindow: function(infoWindow) {
		this.infoWindow = infoWindow;
	}
});