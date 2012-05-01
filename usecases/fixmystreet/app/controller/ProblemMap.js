Ext.define("FixMyStreet.controller.ProblemMap", {
	extend: "FixMyStreet.controller.Map",
	
	config: {
		views: [
			'map.MapContainer'
		],
		refs: {
			mapContainer: '#mapContainer',
			problemMap: '#problemMap',
			problemCurrentLocationButton: '#problemCurrentLocationButton',
			mainTabPanel: '#mainTabPanel',
			filterPopupButton: '#filterPopupButton',
			filterPopupPanel: '#filterPopupPanel',
			typeFilterApplyButton: '#typeFilterApplyButton'
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
			typeFilterApplyButton: {
				tap: 'onTypeFilterApplyButtonTap'
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
			table: FixMyStreet.util.Config.getFusionTable().tableId,
			fields: FixMyStreet.util.Config.getFusionTable().idField + ', ' + FixMyStreet.util.Config.getFusionTable().fields,
			// don't show done problems
			condition: "status NOT EQUAL TO 'done'"
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
					maxWidth: me.getProblemMap().element.dom.clientWidth - 50
				});
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
	
	onFilterPopupButtonTap: function(buttonComp, e, eOpts) {
		this.getFilterPopupPanel().showBy(this.getFilterPopupButton());
	},
	onTypeFilterApplyButtonTap: function(buttonComp, e, eOpts) {
		this.getFilterPopupPanel().hide();
	},
	onFilterPopupPanelHide: function(panelComp, eOpts) {
		var problemMarkers = this.getProblemMarkers();
		for(var markerId in problemMarkers) {
			if(this.getTypeFilterCheckboxStateByTypeId(problemMarkers[markerId].type)) {
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
		me.typeFilterCheckboxStates = {};
		
		// prepare filter popup panel
		this.filterPopupPanel = Ext.create('Ext.Panel', {
			id: 'filterPopupPanel',
			top: 0,
			left: 0,
			modal: true,
			hideOnMaskTap: true
		});
		var fieldset = Ext.create('Ext.form.FieldSet', {
			title: 'Typ-Filter',
			cls: 'typeFilterFieldSet'
		});
		this.typeStore.each(function(type) {
			var typeValue = type.getData().value;
			if(typeValue != 'undefined') {
				me.setTypeFilterCheckboxState(typeValue, true);
				var checkbox = Ext.create('Ext.field.Checkbox', {
					name: typeValue,
					label: type.getData().text,
					checked: true,
					labelWidth: '70%',
					listeners: {
						check: function() {
							me.setTypeFilterCheckboxState(typeValue, true);
						},
						uncheck: function() {
							me.setTypeFilterCheckboxState(typeValue, false);
						}
					}
				})
				fieldset.add(checkbox);
			}
		});
		var applyButton = Ext.create('Ext.Button', {
			text: 'Filter anwenden',
			ui: 'confirm',
			id: 'typeFilterApplyButton'
		})
		
		this.filterPopupPanel.add([fieldset, applyButton]);
    },
	
	setTypeFilterCheckboxState: function(typeid, state) {
		this.typeFilterCheckboxStates[typeid] = state;
	},
	getTypeFilterCheckboxStates: function() {
		return this.typeFilterCheckboxStates;
	},
	getTypeFilterCheckboxStateByTypeId: function(typeid) {
		return this.typeFilterCheckboxStates[typeid];
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
	removeProblemMarkerById: function(id) {
		delete this.problemMarkers[id];
	},
	addProblemMarker: function(id, marker) {
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
	getFilterPopupPanel: function() {
		return this.filterPopupPanel;
	}
});