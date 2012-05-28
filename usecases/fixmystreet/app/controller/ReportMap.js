Ext.define("FixMyStreet.controller.ReportMap", {
	extend: "FixMyStreet.controller.Map",
	
	config: {
		views: [
			'report.ReportContainer',
			'report.InfoPopupPanel',
			'report.ProblemAddedPopupPanel'
		],
		refs: {
			reportMap: '#reportMap',
			addressTextField: '#addressTextField',
			typeSelectField: '#typeSelectField',
			reportButton: '#reportButton',
			reportCurrentLocationButton: '#reportCurrentLocationButton',
			problemList: '#problemList',
			infoPopupButton: '#infoPopupButton',
			infoPopupCloseButton: '#infoPopupCloseButton',
			typePicker: 'picker',
			typePickerSlot: 'pickerslot',
			mainTabPanel: '#mainTabPanel'
		},
		control: {
			reportMap: {
				maprender: 'onMapRender'
			},
			typeSelectField: {
				change: 'onTypeSelectFieldChange'
			},
			reportButton: {
				tap: 'onReportButtonTap'
			},
			reportCurrentLocationButton: {
				tap: 'onCurrentLocationButtonTap'
			},
			infoPopupButton: {
				tap: 'onInfoPopupButtonTap'
			},
			infoPopupCloseButton: {
				tap: 'onInfoPopupCloseButtonTap'
			},
			typePickerSlot: {
				// apply done button after slot itemtap
				itemtap: function() {
					this.getTypePicker().on({
						pick: { fn: 'onDoneButtonTap', single: true }
					});
				}
			}
		}
	},
	
	/**
	 * Called when report map is rendered
	 * @private
	 */
	onMapRender: function(mapComp, map, eOpts) {
		var me = this;
        me.callParent(arguments);
		
		// set displayed property of map in maprender event because we don't have an acitveItemChange listener here   
		mapComp.setDisplayed(true);
		
		if(mapComp.getGeo() && !mapComp.getGeo().isAvailable()) {
			// if geolocation isn't available
			map.setZoom(FixMyStreet.util.Config.getMap().defaultZoom);
			me.getReportCurrentLocationButton().setDisabled(true);
		}
		
		// add click listener to map
		google.maps.event.addListener(map, 'click', function(event) {
			me.setDoubleClickTimeout(Ext.defer(function() {
				me.setProblemMarkerPosition(event.latLng)
			}, 400, me));
		});
		google.maps.event.addListener(map, 'dblclick', function(event) {
			// if click event was already triggered, cancel click action
			if(me.getDoubleClickTimeout()) {
				clearTimeout(me.getDoubleClickTimeout());
				me.setDoubleClickTimeout(null);
			}
		});
		
		var latlng = this.getCurrentLocationLatLng(mapComp);
		
		// add problem marker to map
		me.addProblemMarker(latlng, map);
		
		// center map to current position
		mapComp.setMapCenter(latlng);
    },
	
	/**
	 * Adds problem marker to map
	 * 
	 * @param	latlng		position of marker
	 * @param	map			map on which marker should be displayed
	 * 
	 * @private
	 */
	addProblemMarker: function(latlng, map) {
		var me = this;
		
		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			draggable: true,
			animation: google.maps.Animation.DROP,
			icon: me.getProblemMarkerImagesById('undefined'),
			shadow: me.getMarkerShadow(),
			// do not optimize marker image to recieve retina display support
			optimized: false
		});
		
		// add dragend listener to own position marker
		google.maps.event.addListener(marker, 'dragend', function() {
			me.geocodePosition(marker.getPosition());
		});
		
		// geocode current position and update current address
		me.geocodePosition(latlng);
		
		me.setProblemMarker(marker);
	},
	
	/**
	 * Sets the problem marker position
	 * 
	 * @param	latlng		new position	
	 * 
	 * @private
	 */
	setProblemMarkerPosition: function(latlng) {
		this.getProblemMarker().setPosition(latlng);
		this.geocodePosition(latlng);
	},
	
	/**
	 * Called when problem type gets changed
	 * @private
	 */
	onTypeSelectFieldChange: function(field, newValue, oldValue, eOpts) {
		var me = this;
		
		if(field.getValue() == 'undefined') {
			me.getReportButton().setUi('normal');
		} else {
			me.getReportButton().setUi('confirm');
			this.getTypeSelectField().setCls();
		}
		
		// change marker icon
		var markerIcon = me.getProblemMarkerImagesById(field.getValue());
		me.getProblemMarker().setIcon(markerIcon);
	},
	
	/**
	 * Geocodes given location
	 * 
	 * @param	latlng		Location which should be geocoded
	 * 
	 * @private
	 */
	geocodePosition: function(latlng) {
		var me = this;
		this.getGeocoder().geocode({'latLng': latlng}, function(results, status) {
			if(status == google.maps.GeocoderStatus.OK) {
				if(results[0]) {
					// select address of most accurate result (array position 0)
					me.updateCurrentAddress(results[0].formatted_address);
				}
			}
		});
	},
	
	/**
	 * Updates the current address
	 * @private
	 */
	updateCurrentAddress: function(address) {
		this.setCurrentAddress(address);
		this.getAddressTextField().setValue(address);
	},
	
	/**
	 * Called when report button is tapped
	 * @private
	 */
	onReportButtonTap: function(button, e, eOpts) {
		var me = this;
		
		if(me.getTypeSelectField().getValue() == 'undefined') {
			this.getTypeSelectField().setCls('empty');
		} else {
			var timestamp = new Timestamp();
			this.setTimestamp(timestamp);
			Ext.Msg.confirm('Defekt melden', '<p>' + me.getTypeSelectField().getComponent().getValue() + ' wirklich melden?</p><p>Gewählte Adresse: ' + me.getAddressTextField().getValue() + '</p>', me.handleReportButtonConfirmResponse, me);
		}
	},
	
	/**
	 * Handler of confirm dialog response
	 * @private
	 */
	handleReportButtonConfirmResponse: function(buttonId, value, opt) {
		var me = this;
		if(buttonId == 'yes') {
			// if yes button was clicked
			try {
				// creating new problem instance
				var status = 'new';
				var type = me.getTypeSelectField().getValue();
				
				if(status && type) {
					var problem = Ext.create('FixMyStreet.model.Problem', {
						userid: FixMyStreet.util.Config.getUserId(),
						timestamp: me.getTimestamp().getTimestamp(),
						address: me.getCurrentAddress(),
						latitude: me.getProblemMarker().getPosition().lat(),
						longitude: me.getProblemMarker().getPosition().lng(),
						type: type,
						status: status
					});

					me.getProblemStore().add(problem);
					me.showProblemAddedPopupPanel();
				}
				
				// resetting view data
				me.resetView();
			} catch(err) {
				Ext.Logger.error(err);
			}
		}
	},
	
	/**
	 * Displays the confirmation popup
	 * @private
	 */
	showProblemAddedPopupPanel: function() {
		Ext.Viewport.add(this.getProblemAddedPopupPanel());
		this.getProblemAddedPopupPanel().show();
	},
	
	/**
	 * Resets view state
	 * @private
	 */
	resetView: function() {
		this.getReportButton().setUi('normal');
		this.getTypeSelectField().setCls();
		this.getTypeSelectField().setValue('undefined');
		
		// get current position
		var latlng = this.getCurrentLocationLatLng(this.getReportMap());
		
		this.getReportMap().setMapCenter(latlng);
		this.setProblemMarkerPosition(latlng);
		this.setTimestamp(null);
	},
	
	/**
	 * Called when current location button is tapped
	 * @private
	 */
	onCurrentLocationButtonTap: function(button, e, eOpts) {
		var me = this;
		var mapComp = me.getReportMap();
		
		var latlng = me.getCurrentLocationLatLng(mapComp);
		mapComp.setMapCenter(latlng);
		
		// reset problem marker to own position
		me.setProblemMarkerPosition(latlng);
	},
	
	/**
	 * Called when info button button is tapped
	 * @private
	 */
	onInfoPopupButtonTap: function(button, e, eOpts) {
		this.getInfoPopupPanel().showBy(this.getInfoPopupButton());
	},
	
	/**
	 * Called when info popup close button is tapped
	 * @private
	 */
	onInfoPopupCloseButtonTap: function(button, e, eOpts) {
		this.getInfoPopupPanel().hide();
	},
	
	// -------------------------------------------------------
    // Base Class functions
	// -------------------------------------------------------
    init: function () {
		var me = this;
        me.callParent(arguments);
		
		me.problemStore = Ext.getStore('Problems');
		// adding write listener to problem store to refresh problem list
		me.problemStore.addListener('write', function(store, data, eOpts) {
			Ext.Logger.log('manually refreshing list from controller');
			me.getProblemList().refresh();
		});
		
		me.problemMarker = null;
		me.geocoder = new google.maps.Geocoder();
		me.currentAddress = null;
		me.timestamp = null;
		me.infoPopupPanel = Ext.create('FixMyStreet.view.report.InfoPopupPanel');
		me.problemAddedPopupPanel = Ext.create('FixMyStreet.view.report.ProblemAddedPopupPanel');
		me.doubleClickTimeout = null;
    },
	
	getProblemStore: function() {
		return this.problemStore;
	},
	setProblemStore: function(problemStore) {
		this.problemStore = problemStore;
	},
	getProblemMarker: function() {
		return this.problemMarker;
	},
	setProblemMarker: function(problemMarker) {
		this.problemMarker = problemMarker;
	},
	getGeocoder: function() {
		return this.geocoder;
	},
	setGeocoder: function(geocoder) {
		this.geocoder = geocoder;
	},
	getCurrentAddress: function() {
		return this.currentAddress;
	},
	setCurrentAddress: function(currentAddress) {
		this.currentAddress = currentAddress;
	},
	getTimestamp: function() {
		return this.timestamp;
	},
	setTimestamp: function(timestamp) {
		this.timestamp = timestamp;
	},
	getInfoPopupPanel: function() {
		return this.infoPopupPanel;
	},
	getProblemAddedPopupPanel: function() {
		return this.problemAddedPopupPanel;
	},
	getDoubleClickTimeout: function() {
		return this.doubleClickTimeout;
	},
	setDoubleClickTimeout: function(doubleClickTimeout) {
		this.doubleClickTimeout = doubleClickTimeout;
	}
});