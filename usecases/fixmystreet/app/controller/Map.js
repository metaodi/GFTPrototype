Ext.define("FixMyStreet.controller.Map", {
    extend: "Ext.app.Controller",
	
    config: {
        refs: {
            reportMap: '#reportMap',
			addressTextField: 'textfield[name=address]',
			problemTypeSelectField: 'selectfield[name=problemType]',
			reportButton: '#reportButton'
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
			}
        }
    },
	
    onReportMapMapRender: function(comp, map) {
		var me = this;
		
		var latlng = new google.maps.LatLng(me.getReportMap().getGeo().getLatitude(), me.getReportMap().getGeo().getLongitude());
		
		me.getReportMap().setMapCenter(latlng);
		
		me.geocodePosition(latlng);
		me.addMarkerOwnPosition(latlng);
		
		me.getReportMap().getGeo().addListener('locationupdate', function() {
			me.setOwnPositionMarkerPosition(new google.maps.LatLng(this.getLatitude(), this.getLongitude()));
		});
		
		// custom marker image with shadow
		// - image created with: http://mapicons.nicolasmollet.com/
		// - shadow created with: http://www.cycloloco.com/shadowmaker/shadowmaker.htm
		var markerShadow = new google.maps.MarkerImage(
			'./resources/images/gmap-markers/shadow.png',
			new google.maps.Size(51.0, 37.0),
			null,
			new google.maps.Point(16.0, 37.0)
		);
		var markerIcon = me.getMarkerIcon('undefined');
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

		marker.setMap(me.getReportMap().getMap());
		me.setMarker(marker);
    },
	
	addMarkerOwnPosition: function(latlng) {
		var markerOwnPositionIcon = new google.maps.MarkerImage(
			'./resources/images/gmap-markers/own_position.png',
			new google.maps.Size(20.0, 20.0),
			null,
			new google.maps.Point(10.0, 10.0)
		);
		var markerOwnPosition = new google.maps.Marker({
			map: this.getReportMap().getMap(),
			position: latlng,
			icon: markerOwnPositionIcon,
			clickable: false
		})
		this.setMarkerOwnPosition(markerOwnPosition);
	},
	setOwnPositionMarkerPosition: function(latlng) {
		this.getMarkerOwnPosition().setPosition(latlng);
	},
	
	onProblemTypeChange: function(field, newValue, oldValue, eOpts) {
		// @TODO ugly implementation to remove first item of problem type store (undefined)
		var store = Ext.getStore('ProblemTypes');
		if(field.getValue() != 'undefined' && store.getAt(0).getData().value == 'undefined') {
			this.getReportButton().setDisabled(false);
			store.removeAt(0);
		}
		
		// change marker icon
		var markerIcon = this.getMarkerIcon(field.getValue());
		this.getMarker().setIcon(markerIcon);
	},
	
	getMarkerIcon: function(iconname) {
		return new google.maps.MarkerImage(
			'./resources/images/gmap-markers/' + iconname + '.png',
			new google.maps.Size(32.0, 37.0),
			null,
			new google.maps.Point(16.0, 37.0)
		);
	},
	
	geocodePosition: function(latlng) {
		var scope = this;
		if(!this.disableGeocoding) {
			this.getGeocoder().geocode({'latLng': latlng}, function(results, status) {
				if(status == google.maps.GeocoderStatus.OK) {
					if(results[0]) {
						scope.updateCurrentAddress(results[0].formatted_address);
					}
				}
			});
		} else {
			scope.updateCurrentAddress(latlng);
		}
	},
	
	updateCurrentAddress: function(address) {
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
	
    // Base Class functions.
    launch: function () {
        this.callParent(arguments);
    },
    init: function () {
        this.callParent(arguments);
		
		this.marker = null;
		this.markerOwnPosition = null;
		this.geocoder = new google.maps.Geocoder();
		
		// @TODO remove debug code
		this.disableGeocoding = true;
    },
	
	getGeocoder: function() {
		return this.geocoder;
	},
	setGeocoder: function(geocoder) {
		this.geocoder = geocoder;
	},
	getMarker: function() {
		return this.marker;
	},
	setMarker: function(marker) {
		this.marker = marker;
	},
	getMarkerOwnPosition: function() {
		return this.markerOwnPosition;
	},
	setMarkerOwnPosition: function(markerOwnPosition) {
		this.markerOwnPosition = markerOwnPosition;
	}
});