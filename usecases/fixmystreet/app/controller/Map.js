Ext.define("FixMyStreet.controller.Map", {
	extend: "Ext.app.Controller",
	
	config: {
		refs: {
			reportMap: '#reportMap',
			addressTextField: 'textfield[name=address]',
			problemTypeSelectField: 'selectfield[name=problemType]',
			reportButton: '#reportButton',
			currentLocationButton: '#currentLocationButton'
		},
		control: {
			reportMap: {
				maprender: 'onReportMapMapRender'
			},
			problemTypeSelectField: {
				change: 'onProblemTypeChange'
			},
			reportButton: {
				tap: 'onReportButtonTap'
			},
			currentLocationButton: {
				tap: 'onCurrentLocationButtonTap'
			}
		}
	},
	
	onReportMapMapRender: function(mapComp, map, eOpts) {
		var me = this;
		var geo = mapComp.getGeo();
		
		// get current position
		var latlng = new google.maps.LatLng(geo.getLatitude(), geo.getLongitude());
		
		// center map to current position
		mapComp.setMapCenter(latlng);
		
		// geocode current position and update current address
		me.geocodePosition(latlng);
		
		// add own position marker
		me.addOwnPositionMarker(latlng, map);
		geo.addListener('locationupdate', function() {
			me.setOwnPositionMarkerPosition(new google.maps.LatLng(this.getLatitude(), this.getLongitude()));
		});
		
		// add problem position marker
		me.addProblemMarker(latlng, map);
    },
	
	addOwnPositionMarker: function(latlng, map) {
		var me = this;
		
		var ownPositionMarkerIcon = new google.maps.MarkerImage(
			'./resources/images/gmap-markers/own_position.png',
			new google.maps.Size(20.0, 20.0),
			null,
			new google.maps.Point(10.0, 10.0)
		);
		var ownPositionMarker = new google.maps.Marker({
			map: map,
			position: latlng,
			icon: ownPositionMarkerIcon,
			clickable: false
		})
		me.setOwnPositionMarker(ownPositionMarker);
	},
	setOwnPositionMarkerPosition: function(latlng) {
		var ownPositionMarker = this.getOwnPositionMarker();
		if(ownPositionMarker) {
			ownPositionMarker.setPosition(latlng);
		}
	},
	
	addProblemMarker: function(latlng, map) {
		var me = this;
		
		// custom marker image with shadow
		// - image created with: http://mapicons.nicolasmollet.com/
		// - shadow created with: http://www.cycloloco.com/shadowmaker/shadowmaker.htm
		var markerShadow = new google.maps.MarkerImage(
			'./resources/images/gmap-markers/shadow.png',
			new google.maps.Size(51.0, 37.0),
			null,
			new google.maps.Point(16.0, 37.0)
		);
		var markerIcon = me.getProblemMarkerIcon('undefined');
		var marker = new google.maps.Marker({
			position: latlng,
			draggable: true,
			animation: google.maps.Animation.DROP,
			icon: markerIcon,
			shadow: markerShadow
		});
		
		google.maps.event.addListener(marker, 'dragend', function() {
			var latlng = new google.maps.LatLng(marker.getPosition().lat(), marker.getPosition().lng());
			me.geocodePosition(latlng);
		});

		marker.setMap(map);
		me.setProblemMarker(marker);
	},
	
	onProblemTypeChange: function(field, newValue, oldValue, eOpts) {
		// @TODO ugly implementation to remove first item of problem type store (undefined)
		var store = Ext.getStore('ProblemTypes');
		if(field.getValue() != 'undefined' && store.getAt(0).getData().value == 'undefined') {
			this.getReportButton().setDisabled(false);
			store.removeAt(0);
		}
		
		// change marker icon
		var markerIcon = this.getProblemMarkerIcon(field.getValue());
		this.getProblemMarker().setIcon(markerIcon);
	},
	
	getProblemMarkerIcon: function(iconname) {
		return new google.maps.MarkerImage(
			'./resources/images/gmap-markers/' + iconname + '.png',
			new google.maps.Size(32.0, 37.0),
			null,
			new google.maps.Point(16.0, 37.0)
		);
	},
	
	geocodePosition: function(latlng) {
		var me = this;
		if(!this.disableGeocoding) {
			this.getGeocoder().geocode({'latLng': latlng}, function(results, status) {
				if(status == google.maps.GeocoderStatus.OK) {
					if(results[0]) {
						me.updateCurrentAddress(results[0].formatted_address);
					}
				}
			});
		} else {
			me.updateCurrentAddress(latlng);
		}
	},
	
	updateCurrentAddress: function(address) {
		this.setCurrentAddress(address);
		this.getAddressTextField().setValue(address);
	},
	
	onReportButtonTap: function(button, e, eOpts) {
		Ext.Msg.confirm('Defekt melden', 'Defekt ' + this.getProblemTypeSelectField().getValue() + ' wirklich melden?<br />Adresse: ' + this.getAddressTextField().getValue(), this.handleReportButtonConfirmResponse);
	},
	
	handleReportButtonConfirmResponse: function(buttonId, value, opt) {
		if(buttonId == 'yes') {
			console.log('sende defekt');
		} else {
			console.log('abbruch');
		}
	},
	
	onCurrentLocationButtonTap: function(button, e, eOpts) {
		this.setMapCenterToCurrentLocation();
	},
	
	setMapCenterToCurrentLocation: function() {
		var mapComp = this.getReportMap();
		if(mapComp) {
			// center map to current location
			var geo = mapComp.getGeo();

			// get current position
			var latlng = new google.maps.LatLng(geo.getLatitude(), geo.getLongitude());

			// center map to current position
			mapComp.setMapCenter(latlng);
		}
	},
	
    // Base Class functions.
    launch: function () {
        this.callParent(arguments);
    },
    init: function () {
        this.callParent(arguments);
		
		this.problemMarker = null;
		this.ownPositionMarker = null;
		this.geocoder = new google.maps.Geocoder();
		this.currentAddress = null;
		
		// @TODO remove debug code
		this.disableGeocoding = true;
    },
	
	getProblemMarker: function() {
		return this.problemMarker;
	},
	setProblemMarker: function(problemMarker) {
		this.problemMarker = problemMarker;
	},
	getOwnPositionMarker: function() {
		return this.ownPositionMarker;
	},
	setOwnPositionMarker: function(ownPositionMarker) {
		this.ownPositionMarker = ownPositionMarker;
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
	}
});