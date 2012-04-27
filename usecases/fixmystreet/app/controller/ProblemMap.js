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
			this.setPollingEnabled(true);
			this.refreshData();
		} else {
			this.setPollingEnabled(false);
		}
	},
	
	onMapRender: function(mapComp, map, eOpts) {
		var me = this;
        me.callParent(arguments);
		
		// create infowindow with maxWidth depending on trailsMap panelsize
		var infoWindow = new google.maps.InfoWindow({
			// @TODO possible Sencha bug - getSize() always returns null for width and height
			maxWidth: this.getProblemMap().getSize().width - 50
		});
		me.setInfoWindow(infoWindow);
		
		if(mapComp.getGeo() && !mapComp.getGeo().isAvailable()) {
			// if geolocation isn't available
			me.getProblemCurrentLocationButton().setDisabled(true);
		}
    },
	
	refreshData: function() {
		var me = this;
		if(me.getPollingEnabled()) {
			if(me.getMapRendered()) {
				me.recieveData();
			}
			setTimeout(function() { me.refreshData(); }, FixMyStreet.util.Config.getPollingFrequency());
		}
	},
	
	recieveData: function() {
		var me = this;
		
		// add problem markers to map
		FixMyStreet.gftLib.execSelect(me.syncProblemMarkers, {
			table: '1ggQAh0WF7J7myI27_Pv4anl0wBJQ7ERt4W5E6QQ',
			fields: 'ROWID, userId, externalId, timestamp, latitude, longitude, address, type, status'
		}, me);
	},
	
	syncProblemMarkers: function(data) {
		var dataObjs = FixMyStreet.gftLib.convertToObject(data);
		
		var currentRowIds = {};
		for(var problem in dataObjs) {
			currentRowIds[dataObjs[problem].rowid] = true;
			this.addProblemMarkerToMap(this.getProblemMap().getMap(), dataObjs[problem]);
		}
		
		for(var markerId in this.getProblemMarkers()) {
			if(!currentRowIds[markerId]) {
				this.removeProblemMarkerFromMap(markerId);
			}
		}
	},
	
	addProblemMarkerToMap: function(map, problem) {
		var me = this;
		
		// if marker for current problem isn't painted yet
		if(!me.getProblemMarkerById(problem.rowid)) {
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(problem.latitude, problem.longitude),
				map: map,
				animation: google.maps.Animation.DROP,
				icon: me.getProblemMarkerImagesById(problem.type),
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
			me.addProblemMarker(problem.rowid, marker);
		}
	},
	
	removeProblemMarkerFromMap: function(rowid) {
		var marker = this.getProblemMarkerById(rowid);
		google.maps.event.removeListener(marker.listener);
		marker.setMap(null);
		// delete marker in object
		this.removeProblemMarkerById(rowid);
	},
	
	onCurrentLocationButtonTap: function(button, e, eOpts) {
		var me = this;
		var map = me.getProblemMap();
		
		var latlng = me.getCurrentLocationLatLng(map);
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
		
		me.typeStore = Ext.getStore('ProblemTypes');
		me.problemMarkers = {};
		me.infoWindow = null;
		
		me.pollingEnabled = false;
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
	getProblemMarkerById: function(id) {
		return this.problemMarkers[id];
	},
	removeProblemMarkerById: function(id) {
		delete this.problemMarkers[id];
	},
	addProblemMarker: function(id, marker) {
		this.problemMarkers[id] = marker;
	},
	getInfoWindow: function() {
		return this.infoWindow;
	},
	setInfoWindow: function(infoWindow) {
		this.infoWindow = infoWindow;
	},
	getPollingEnabled: function() {
		return this.pollingEnabled;
	},
	setPollingEnabled: function(pollingEnabled) {
		this.pollingEnabled = pollingEnabled;
	}
});