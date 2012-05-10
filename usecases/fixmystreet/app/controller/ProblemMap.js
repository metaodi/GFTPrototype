Ext.define("FixMyStreet.controller.ProblemMap", {
	extend: "FixMyStreet.controller.Map",
	
	config: {
		views: [
			'map.MapContainer',
			'map.FilterPopupPanel'
		],
		refs: {
			mapContainer: '#mapContainer',
			problemMap: '#problemMap',
			problemCurrentLocationButton: '#problemCurrentLocationButton',
			filterPopupButton: '#filterPopupButton',
			filterPopupPanel: '#filterPopupPanel',
			filterPopupCloseButton: '#filterPopupCloseButton',
			filterPopupApplyButton: '#filterPopupApplyButton'
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
			},
			filterPopupButton: {
				tap: 'onFilterPopupButtonTap'
			},
			filterPopupPanel: {
				hide: 'onFilterPopupPanelHide'
			},
			filterPopupCloseButton: {
				tap: 'onFilterPopupCloseButtonTap'
			},
			filterPopupApplyButton: {
				tap: 'onFilterPopupApplyButtonTap'
			}
		}
	},
	
	onTabPanelActiveItemChange: function(tapPanelComp, value, oldValue, eOpts) {
		if(value.getId() == 'mapContainer') {
			this.setPollingEnabled(true);
			this.setBoundsChangedListenerEnabled(true);
		} else {
			this.setPollingEnabled(false);
			this.setBoundsChangedListenerEnabled(false);
		}
	},
	
	onMapRender: function(mapComp, map, eOpts) {
		var me = this;
        me.callParent(arguments);
		
		if(mapComp.getGeo() && !mapComp.getGeo().isAvailable()) {
			// if geolocation isn't available
			me.getProblemCurrentLocationButton().setDisabled(true);
		}
		
		// load problems for new map bound
		google.maps.event.addListener(map, 'bounds_changed', function() {
			me.onMapBoundsChanged();
		});
    },
	
	onMapBoundsChanged: function() {
		var me = this;
		
		// check if a bounds changed event timeout is set
		if(me.getBoundsChangedTimeout()) {
			// bounds change while timeout is still active -> clear timeout and set new one
			clearTimeout(me.getBoundsChangedTimeout());
			me.setBoundsChangedTimeout(null);
			me.setBoundsChangedListenerEnabled(true);
		}
		
		if(me.getBoundsChangedListenerEnabled()) {
			// defer marker loading to prevent too much requests to fusion table
			var boundsChangedTimeout = Ext.defer(function() {
				me.refreshData();
			}, 1500, me);
			me.setBoundsChangedTimeout(boundsChangedTimeout);
			me.setBoundsChangedListenerEnabled(false);
		}
	},
	
	refreshData: function() {
		var me = this;
		
		if(me.getNextPollTimeout()) {
			clearTimeout(me.getNextPollTimeout());
			me.setNextPollTimeout(null);
		}
		
		if(me.getPollingEnabled()) {
			if(me.getMapRendered()) {
				me.recieveData();
			}
			
			// wait for next polling call
			var nextPollTimeout = Ext.defer(function() {
				me.refreshData();
			}, FixMyStreet.util.Config.getPollingFrequency(), this);
			
			me.setNextPollTimeout(nextPollTimeout);
		}
		me.setBoundsChangedListenerEnabled(true);
	},
	
	recieveData: function() {
		var me = this;
		
		// create spatial condition to recieve only markers in displayed map
		var mapBounds = me.getProblemMap().getMap().getBounds();
		var lowerLeftCorner = 'LATLNG(' + mapBounds.getSouthWest().lat() + ',' + mapBounds.getSouthWest().lng() + ')';
		var upperRightCorner = 'LATLNG(' + mapBounds.getNorthEast().lat() + ',' + mapBounds.getNorthEast().lng() + ')';
		var spatialQuery = "ST_INTERSECTS(latitude, RECTANGLE(" + lowerLeftCorner + ", " + upperRightCorner + "))";
		
		// add problem markers to map
		FixMyStreet.gftLib.execSelect(me.syncProblemMarkers, {
			table: FixMyStreet.util.Config.getFusionTable().readTableId,
			fields: FixMyStreet.util.Config.getFusionTable().idField + ', ' + FixMyStreet.util.Config.getFusionTable().fields,
			// don't show done problems
			conditions: [spatialQuery, "status NOT EQUAL TO 'done'"]
		}, me);
	},
	
	syncProblemMarkers: function(data) {
		var dataObjs = FixMyStreet.gftLib.convertToObject(data);
		
		var currentRowIds = {};
		for(var problem in dataObjs) {
			currentRowIds[dataObjs[problem].rowid] = true;
			this.addProblemMarker(this.getProblemMap().getMap(), dataObjs[problem]);
		}
		
		for(var markerId in this.getProblemMarkers()) {
			if(!currentRowIds[markerId]) {
				this.removeProblemMarker(markerId);
			}
		}
	},
	
	addProblemMarker: function(map, problem) {
		var me = this;
		
		// if marker for current problem isn't painted yet
		if(!me.getProblemMarkerById(problem.rowid)) {
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(problem.latitude, problem.longitude),
				animation: google.maps.Animation.DROP,
				icon: me.getProblemMarkerImagesById(problem.type),
				shadow: me.getMarkerShadow(),
				// do not optimize marker image to recieve retina display support
				optimized: false
			});
			
			// show marker on map if type is activated
			if(me.getTypeFilterToggleStateByTypeId(problem.type)) {
				marker.setMap(map);
			}
			
			var typeText = me.getTypeStore().getById(problem.type).getData().text;
			var statusValue = me.getStatusStore().getById(problem.status).getData().value;
			
			marker.type = problem.type;
			marker.content =
				'<div class="infowindow-content">' +
					'<div class="trail-info">' +
						'<p class="date">' + new Timestamp(parseInt(problem.timestamp)).getDate() + '</p>' +
						'<div class="image"><img src="./resources/images/problem-types/' + problem.type + '.png" /></div>' +
						'<div class="info">' +
							'<h1>' + typeText + '<span class="status ' + problem.status + '">' + statusValue + '</span></h1>' +
							'<p class="address">' + problem.address + '</p>' +
						'</div>' +
					'</div>' +
				'</div>';

			marker.listener = google.maps.event.addListener(marker, 'click', function() {
				// this attribute references to the current marker
				me.getInfoWindow().setOptions({
					content: this.content,
					// set infowindow size depending on current map size
					maxWidth: me.getProblemMap().element.getSize().width - 50
				});
				me.getInfoWindow().open(map, this);
			});
			
			// add marker to problem markers array
			me.addProblemMarkerToArray(problem.rowid, marker);
		}
	},
	
	removeProblemMarker: function(rowid) {
		var marker = this.getProblemMarkerById(rowid);
		google.maps.event.removeListener(marker.listener);
		marker.setMap(null);
		// delete marker in object
		this.removeProblemMarkerFromArrayById(rowid);
	},
	
	onCurrentLocationButtonTap: function(button, e, eOpts) {
		var me = this;
		var map = me.getProblemMap();
		
		var latlng = me.getCurrentLocationLatLng(map);
		map.setMapCenter(latlng);
	},
	
	onFilterPopupButtonTap: function(buttonComp, e, eOpts) {
		this.getFilterPopupPanel().showBy(this.getFilterPopupButton());
	},
	onFilterPopupCloseButtonTap: function(buttonComp, e, eOpts) {
		this.getFilterPopupPanel().hide();
	},
	onFilterPopupApplyButtonTap: function(buttonComp, e, eOpts) {
		this.getFilterPopupPanel().hide();
	},
	onFilterPopupPanelHide: function(panelComp, eOpts) {
		var problemMarkers = this.getProblemMarkers();
		for(var markerId in problemMarkers) {
			if(this.getTypeFilterToggleStateByTypeId(problemMarkers[markerId].type)) {
				problemMarkers[markerId].setMap(this.getProblemMap().getMap());
			} else {
				problemMarkers[markerId].setMap(null);
			}
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
		
		me.typeStore = Ext.getStore('Types');
		me.statusStore = Ext.getStore('Status');
		me.problemMarkers = {};
		me.infoWindow = new google.maps.InfoWindow();
		
		me.pollingEnabled = false;
		me.nextPollTimeout = null;
		me.boundsChangedListenerEnabled = false;
		me.boundsChangedTimeout = null;
		me.typeFilterToggleStates = {};
		
		// prepare filter popup panel
		this.filterPopupPanel = Ext.create('FixMyStreet.view.map.FilterPopupPanel');
		var fieldset = Ext.create('Ext.form.FieldSet', {
			cls: 'typeFilterFieldSet'
		});
		this.typeStore.each(function(type) {
			var typeValue = type.getData().value;
			if(typeValue != 'undefined') {
				me.setTypeFilterToggleState(typeValue, true);
				var toggle = Ext.create('Ext.field.Toggle', {
					name: typeValue,
					label: type.getData().text,
					value: 1,
					labelWidth: '60%',
					listeners: {
						change: function(sliderField, slider, thumb, newValue, oldValue, eOpts) {
							me.setTypeFilterToggleState(typeValue, newValue);
						}
					}
				})
				fieldset.add(toggle);
			}
		});
		var applyButton = Ext.create('Ext.Button', {
			text: 'Filter anwenden',
			ui: 'confirm',
			id: 'filterPopupApplyButton'
		})
		
		this.filterPopupPanel.add([fieldset, applyButton]);
    },
	
	setTypeFilterToggleState: function(typeid, state) {
		this.typeFilterToggleStates[typeid] = state;
	},
	getTypeFilterToggleStates: function() {
		return this.typeFilterToggleStates;
	},
	getTypeFilterToggleStateByTypeId: function(typeid) {
		return this.typeFilterToggleStates[typeid];
	},
	getTypeStore: function() {
		return this.typeStore;
	},
	getStatusStore: function() {
		return this.statusStore;
	},
	getProblemMarkers: function() {
		return this.problemMarkers;
	},
	getProblemMarkerById: function(id) {
		return this.problemMarkers[id];
	},
	removeProblemMarkerFromArrayById: function(id) {
		delete this.problemMarkers[id];
	},
	addProblemMarkerToArray: function(id, marker) {
		this.problemMarkers[id] = marker;
	},
	getInfoWindow: function() {
		return this.infoWindow;
	},
	getPollingEnabled: function() {
		return this.pollingEnabled;
	},
	setPollingEnabled: function(pollingEnabled) {
		this.pollingEnabled = pollingEnabled;
	},
	getBoundsChangedTimeout: function() {
		return this.boundsChangedTimeout;
	},
	setBoundsChangedTimeout: function(boundsChangedTimeout) {
		this.boundsChangedTimeout = boundsChangedTimeout;
	},
	getNextPollTimeout: function() {
		return this.nextPollTimeout;
	},
	setNextPollTimeout: function(nextPollTimeout) {
		this.nextPollTimeout = nextPollTimeout;
	},
	getBoundsChangedListenerEnabled: function() {
		return this.boundsChangedListenerEnabled;
	},
	setBoundsChangedListenerEnabled: function(boundsChangedListenerEnabled) {
		this.boundsChangedListenerEnabled = boundsChangedListenerEnabled;
	},
	getFilterPopupPanel: function() {
		return this.filterPopupPanel;
	}
});
