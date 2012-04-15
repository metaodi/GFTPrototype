Ext.define("FixMyStreet.controller.Map", {
    extend: "Ext.app.Controller",
	
    config: {
        refs: {
            gftmap: '#gftmap',
			addressTextField: 'textfield[name=address]'
        },
        control: {
            gftmap: {
                maprender: "onMaprender"
            },
            'selectfield[name=type]': {
                change: "onTypeChange"
            }
        }
    },
	
    onMaprender: function(comp, map) {
		var latlng = new google.maps.LatLng(this.getGftmap().getGeo().getLatitude(), this.getGftmap().getGeo().getLongitude());
		
		this.geocodePosition(latlng);
		this.addMarkerOwnPosition(latlng);
		
		// custom marker image with shadow
		// - image created with: http://mapicons.nicolasmollet.com/
		// - shadow created with: http://www.cycloloco.com/shadowmaker/shadowmaker.htm
		var markerShadow = new google.maps.MarkerImage(
			'./resources/images/gmap-markers/shadow.png',
			new google.maps.Size(51.0, 37.0),
			null,
			new google.maps.Point(16.0, 37.0)
		);
		var markerIcon = new google.maps.MarkerImage(
			'./resources/images/gmap-markers/undefined.png',
			new google.maps.Size(32.0, 37.0),
			null,
			new google.maps.Point(16.0, 37.0)
		);
		var marker = new google.maps.Marker({
			position: latlng,
			draggable: true,
			animation: google.maps.Animation.DROP,
			icon: markerIcon,
			shadow: markerShadow
		});
		
		var scope = this;
		
		google.maps.event.addListener(marker, 'dragend', function() {
			var latlng = new google.maps.LatLng(marker.getPosition().lat(), marker.getPosition().lng());
			scope.geocodePosition(latlng);
		});
		
		marker.setMap(this.getGftmap().getMap());
		this.setMarker(marker);
    },
	
	addMarkerOwnPosition: function(latlng) {
		var markerOwnPositionIcon = new google.maps.MarkerImage(
			'./resources/images/gmap-markers/own_position.png',
			new google.maps.Size(20.0, 20.0),
			null,
			new google.maps.Point(10.0, 10.0)
		);
		var markerOwnPosition = new google.maps.Marker({
			map: this.getGftmap().getMap(),
			position: latlng,
			icon: markerOwnPositionIcon,
			clickable: false
		})
		this.setMarkerOwnPosition(markerOwnPosition);
	},
	
	onTypeChange: function(field, newValue, oldValue, eOpts) {
		var markerIcon = new google.maps.MarkerImage(
			'./resources/images/gmap-markers/' + newValue.getData().value + '.png',
			new google.maps.Size(32.0, 37.0),
			null,
			new google.maps.Point(16.0, 37.0)
		);
		
		this.getMarker().setIcon(markerIcon);
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