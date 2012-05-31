Ext.define("FixMyStreet.controller.ProblemMap", {
	extend: "FixMyStreet.controller.Map",
	
	config: {
		views: [
			'map.MapContainer',
			'map.LayerSegmentedButton',
			'map.SettingsPopupPanel'
		],
		refs: {
			mapContainer: '#mapContainer',
			problemMap: '#problemMap',
			problemCurrentLocationButton: '#problemCurrentLocationButton',
			mainTabPanel: '#mainTabPanel',
			settingsPopupButton: '#settingsPopupButton',
			settingsPopupPanel: '#settingsPopupPanel',
			settingsPopupCloseButton: '#settingsPopupCloseButton',
			layerSegementedButton: '#layerSegementedButton',
			markerLayerButton: '#markerLayerButton',
			heatmapLayerButton: '#heatmapLayerButton'
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
			settingsPopupButton: {
				tap: 'onSettingsPopupButtonTap'
			},
			settingsPopupPanel: {
				hide: 'onSettingsPopupPanelHide'
			},
			settingsPopupCloseButton: {
				tap: 'onSettingsPopupCloseButtonTap'
			}
		}
	},
	
	/**
	 * Called when avtive item of tappanel changes
	 * @private
	 */
	onTabPanelActiveItemChange: function(tapPanelComp, value, oldValue, eOpts) {
		if(value === this.getMapContainer()) {
			// if new activepanel is problem map enable polling and refresh data
			this.getProblemMap().setDisplayed(true);
			this.setPollingEnabled(true);
			this.setBoundsChangedListenerEnabled(true);
			// trigger bounds changed event to refresh data
			this.onMapBoundsChanged();
		} else {
			// if new activepanel something else disable polling
			clearTimeout(this.getBoundsChangedTimeout());
			this.setBoundsChangedTimeout(null);
			clearTimeout(this.getNextPollTimeout());
			this.setNextPollTimeout(null);
			this.setPollingEnabled(false);
			this.setBoundsChangedListenerEnabled(false);
		}
	},
	
	/**
	 * Called when problem map is rendered
	 * @private
	 */
	onMapRender: function(mapComp, map, eOpts) {
		var me = this;
        me.callParent(arguments);
		
		if(mapComp.getGeo() && !mapComp.getGeo().isAvailable()) {
			// if geolocation isn't available
			me.getProblemCurrentLocationButton().setDisabled(true);
		}
		
		// if map isn't rendered from a route with latitude/longitude -> center map to current location
		if (this.getApplication().getController('Main').getCenterToOwnPosition()) {
			mapComp.setMapCenter(me.getCurrentLocationLatLng(mapComp));
		}
		
		// load problems for new map bound
		google.maps.event.addListener(map, 'bounds_changed', function() {
			me.onMapBoundsChanged();
		});
    },
	
	/**
	 * Called when map bounds have changed
	 * @private
	 */
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
	
	/**
	 * Refreshes problem data (markers, heatmap)
	 * @private
	 */
	refreshData: function() {
		Ext.Logger.log(new Date());
		Ext.Logger.log('refresh data');
		var me = this;
		
		if(me.getNextPollTimeout()) {
			clearTimeout(me.getNextPollTimeout());
			me.setNextPollTimeout(null);
		}
		
		if(me.getPollingEnabled()) {
			if(me.getProblemMap().getRendered()) {
				me.updateMarkers();
				me.updateFusionTablesLayer();
			}
			
			// wait for next polling call
			var nextPollTimeout = Ext.defer(function() {
				me.refreshData();
			}, FixMyStreet.util.Config.getPollingFrequency(), this);
			
			me.setNextPollTimeout(nextPollTimeout);
		}
		me.setBoundsChangedListenerEnabled(true);
	},
	
	/**
	 * Updates fusiontableslayer
	 * @private
	 */
	updateFusionTablesLayer: function() {
		var typeFilterToggleStates = this.getTypeFilterToggleStates();
		
		// create condition for fusiontableslayer
		var condition = FixMyStreet.util.Config.getFusionTable().typeField + ' IN (';
		var activeTypesArr = [];
		
		for(var type in typeFilterToggleStates) {
			if(typeFilterToggleStates[type]) {
				activeTypesArr.push("'" + type + "'");
			}
		}
		
		// add empty string to active types array to recieve correct condition string
		if(activeTypesArr.length < 1) {
			activeTypesArr.push("''");
		}
		
		condition += activeTypesArr.join(", ");
		condition += ')';
		
		// set new condition
		this.getFusionTablesLayer().setOptions({
			query: {
				select: FixMyStreet.util.Config.getFusionTable().locationField,
				from: FixMyStreet.util.Config.getFusionTable().readTableId,
				where: condition
			},
			heatmap: {
				enabled: true
			}
		});
	},
	
	/**
	 * Updates markers
	 * @private
	 */
	updateMarkers: function() {
		var me = this;
		
		// create spatial condition to recieve only markers in displayed map
		var mapBounds = me.getProblemMap().getMap().getBounds();
		var lowerLeftCorner = 'LATLNG(' + mapBounds.getSouthWest().lat() + ',' + mapBounds.getSouthWest().lng() + ')';
		var upperRightCorner = 'LATLNG(' + mapBounds.getNorthEast().lat() + ',' + mapBounds.getNorthEast().lng() + ')';
		var spatialQuery = "ST_INTERSECTS(" + FixMyStreet.util.Config.getFusionTable().locationField + ", RECTANGLE(" + lowerLeftCorner + ", " + upperRightCorner + "))";
		
		// BUGFIX for FusionTable Bug:
		// Newly inserted records aren't geocoded and do not appear in a query with a spatial condition
		var conditionLatLow = "latitude >= " + mapBounds.getSouthWest().lat();
		var conditionLatHigh = "latitude <= " + mapBounds.getNorthEast().lat();
		var conditionLngLow = "longitude >= " + mapBounds.getSouthWest().lng();
		var conditionLngHigh =  "longitude <= " + mapBounds.getNorthEast().lng();
		
		// requesting problems from fusiontable
		FixMyStreet.gftLib.execSelect(me.syncProblemMarkers, {
			table: FixMyStreet.util.Config.getFusionTable().readTableId,
			fields: FixMyStreet.util.Config.getFusionTable().idField + ', ' + FixMyStreet.util.Config.getFusionTable().fields,
			conditions: [conditionLatLow, conditionLatHigh, conditionLngLow, conditionLngHigh, "status NOT EQUAL TO 'done'"]
		}, me);
	},
	
	/**
	 * Synchronizes problem markers with recieved data from fusiontable
	 * @private
	 */
	syncProblemMarkers: function(data) {
		var dataObjs = FixMyStreet.gftLib.convertToObject(data);
		
		var currentRowIds = {};
		for(var problemRow in dataObjs) {
			currentRowIds[dataObjs[problemRow].rowid] = true;
			this.addProblemMarker(this.getProblemMap().getMap(), dataObjs[problemRow]);
		}
		
		for(var markerId in this.getProblemMarkers()) {
			if(!currentRowIds[markerId]) {
				this.removeProblemMarker(markerId);
			}
		}
	},
	
	/**
	 * Creates a new problem marker from a given fusiontable row
	 * 
	 * @param	map				map on which the marker should be added
	 * @param	problemRow		row from fusiontable
	 * 
	 * @private
	 */
	addProblemMarker: function(map, problemRow) {
		var me = this;
		
		// if marker for current problem isn't painted yet
		if(!me.getProblemMarkerById(problemRow.rowid)) {
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(problemRow.latitude, problemRow.longitude),
				animation: google.maps.Animation.DROP,
				icon: me.getProblemMarkerImagesById(problemRow.type),
				shadow: me.getMarkerShadow(),
				// do not optimize marker image to recieve retina display support
				optimized: false
			});
			
			// show marker only when marker layer is activated and when problem type is activated
			if(me.isMarkerLayerButtonPressed() && me.getTypeFilterToggleStateByTypeId(problemRow.type)) {
				marker.setMap(map);
			}
			
			// get type
			var type = me.getTypeStore().getById(problemRow.type);
			var typeText = problemRow.type;
			if(type) {
				typeText = type.get('text');
			}
			// get status
			var status =  me.getStatusStore().getById(problemRow.status);
			var statusValue = problemRow.status;
			if(status) {
				statusValue = status.get('value');
			}
			
			marker.type = problemRow.type;
			marker.content =
				'<div class="infowindow-content">' +
					'<div class="trail-info">' +
						'<p class="date">' + new Timestamp(parseInt(problemRow.timestamp)).getDate() + '</p>' +
						'<div class="image"><img src="./resources/images/problem-types/' + problemRow.type + '.png" /></div>' +
						'<div class="info">' +
							'<h1>' + typeText + '<span class="status ' + problemRow.status + '">' + statusValue + '</span></h1>' +
							'<p class="address">' + problemRow.address + '</p>' +
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
			me.addProblemMarkerToArray(problemRow.rowid, marker);
		}
	},
	
	/**
	 * Removes a problem marker
	 * 
	 * @param	rowid	RowId of marker which should be removed
	 * 
	 * @private
	 */
	removeProblemMarker: function(rowid) {
		var marker = this.getProblemMarkerById(rowid);
		google.maps.event.removeListener(marker.listener);
		marker.setMap(null);
		// delete marker in object
		this.removeProblemMarkerFromArrayById(rowid);
	},
	
	/**
	 * Called when current location button is tapped
	 * @private
	 */
	onCurrentLocationButtonTap: function(button, e, eOpts) {
		var me = this;
		var mapComp = me.getProblemMap();
		
		var latlng = me.getCurrentLocationLatLng(mapComp);
		mapComp.setMapCenter(latlng);
	},
	
	/**
	 * Called when settings button is tapped
	 * @private
	 */
	onSettingsPopupButtonTap: function(buttonComp, e, eOpts) {
		this.getSettingsPopupPanel().showBy(this.getSettingsPopupButton());
	},
	
	/**
	 * Called when settings popup close button is tapped
	 * @private
	 */
	onSettingsPopupCloseButtonTap: function(buttonComp, e, eOpts) {
		this.getSettingsPopupPanel().hide();
	},
	
	/**
	 * Called when settings popup hides
	 * @private
	 */
	onSettingsPopupPanelHide: function(panelComp, eOpts) {
		if(this.isMarkerLayerButtonPressed()) {
			this.showMarkerLayer();
		}
		if(this.isHeatmapLayerButtonPressed()) {
			this.showHeatmapLayer();
		}
	},
	
	/**
	 * Shows marker layer on map and deactivates heatmap layer
	 * @private
	 */
	showMarkerLayer: function() {
		// hide heatmap layer
		this.getFusionTablesLayer().setMap(null);
		
		// show markers
		var problemMarkers = this.getProblemMarkers();
		for(var markerId in problemMarkers) {
			// show marker only problem type is activated
			if(this.getTypeFilterToggleStateByTypeId(problemMarkers[markerId].type)) {
				problemMarkers[markerId].setMap(this.getProblemMap().getMap());
			} else {
				problemMarkers[markerId].setMap(null);
			}
		}
	},
	
	/**
	 * Shows heatmap layer on map and deactivates marker layer
	 * @private
	 */
	showHeatmapLayer: function() {
		// hide markers
		var problemMarkers = this.getProblemMarkers();
		for(var markerId in problemMarkers) {
			problemMarkers[markerId].setMap(null);
		}
		
		// show heatmap layer
		this.updateFusionTablesLayer();
		this.getFusionTablesLayer().setMap(this.getProblemMap().getMap());
	},
	
	/**
	 * Tells if marker layer button is pressed or not
	 * @private
	 */
	isMarkerLayerButtonPressed: function() {
		return this.getLayerSegementedButton().getPressedButtons()[0] == this.getMarkerLayerButton();
	},
	/**
	 * Tells if heatmap layer button is pressed or not
	 * @private
	 */
	isHeatmapLayerButtonPressed: function() {
		return this.getLayerSegementedButton().getPressedButtons()[0] == this.getHeatmapLayerButton();
	},
	
	// -------------------------------------------------------
    // Base Class functions
	// -------------------------------------------------------
    init: function () {
		var me = this;
		
        me.callParent(arguments);
		
		me.typeStore = Ext.getStore('Types');
		me.statusStore = Ext.getStore('Status');
		me.problemMarkers = {};
		me.infoWindow = new google.maps.InfoWindow();
		// create fusion tables layer for heatmap
		me.fusionTablesLayer = new google.maps.FusionTablesLayer();
		
		me.pollingEnabled = false;
		me.nextPollTimeout = null;
		me.boundsChangedListenerEnabled = false;
		me.boundsChangedTimeout = null;
		me.typeFilterToggleStates = {};
		
		// prepare filter popup panel
		this.settingsPopupPanel = Ext.create('FixMyStreet.view.map.SettingsPopupPanel');
		var fieldset = Ext.create('Ext.form.FieldSet', {
			cls: 'typeFilterFieldSet'
		});
		// add a toogle field for each type
		this.typeStore.each(function(type) {
			var typeValue = type.get('value');
			if(typeValue != 'undefined') {
				me.setTypeFilterToggleState(typeValue, true);
				var toggle = Ext.create('Ext.field.Toggle', {
					name: typeValue,
					label: type.get('text'),
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
		
		// add fieldset to popup panel
		this.settingsPopupPanel.add([fieldset]);
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
	getFusionTablesLayer: function() {
		return this.fusionTablesLayer;
	},
	setFusionTablesLayer: function(fusionTablesLayer) {
		this.fusionTablesLayer = fusionTablesLayer;
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
	getSettingsPopupPanel: function() {
		return this.settingsPopupPanel;
	}
});
