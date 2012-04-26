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
    },
	
	addProblemMarkers: function(data, scope) {
		var dataObjs = FixMyStreet.gftLib.convertToObject(data);
		
		for(var problem in dataObjs) {
			scope.addProblemMarker(scope.getProblemMap().getMap(), dataObjs[problem]);
		}
	},
	
	addProblemMarker: function(map, problem) {
		var me = this;
		
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(problem.latitude, problem.longitude),
			map: map,
			icon: me.getProblemMarkerImages()[problem.type],
			shadow: me.getMarkerShadow(),
			// do not optimize marker image to recieve retina display support
			optimized: false
		});
		
		var typeText = me.getTypeStore().getById(problem.type).getData().text;
		
		marker.content =
			'<div class="infowindow-content">' +
				'<div class="trail-info">' +
					'<p class="date">' + new Timestamp(parseInt(problem.timestamp)).getDate() + '</p>' +
					'<div class="image"><img src="./resources/images/problem-types/' + problem.type + '.png" /></div>' +
					'<div class="info">' +
						'<h1>' + typeText + '</h1>' +
						'<p class="address">' + problem.address + '</p>' +
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
			
			// add problem markers to map
			FixMyStreet.gftLib.execSelect(function(data) { me.addProblemMarkers(data, me) }, {
				table: '1ggQAh0WF7J7myI27_Pv4anl0wBJQ7ERt4W5E6QQ',
				fields: 'ROWID, userId, externalId, timestamp, latitude, longitude, address, type, status'
			});
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
		
		me.typeStore = Ext.getStore('ProblemTypes');
		me.problemMarkers = [];
		
		// create infowindow with maxWidth depending on trailsMap panelsize (all markers will use this infowindow)
		me.infoWindow = new google.maps.InfoWindow({
			// @TODO get width of parent map
			//maxWidth: this.getProblemMap().getSize().width - 50
		});
    },
	
	getTypeStore: function() {
		return this.typeStore;
	},
	setTypeStore: function(typeStore) {
		this.typeStore = typeStore;
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