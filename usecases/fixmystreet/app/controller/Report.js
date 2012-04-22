Ext.define("FixMyStreet.controller.Report", {
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
		var latlng = this.getCurrentLocationLatLng();
		
		// center map to current position
		mapComp.setMapCenter(latlng);
		
		// geocode current position and update current address
		me.geocodePosition(latlng);
		
		// add own position marker to map
		me.addOwnPositionMarker(latlng, map);
		geo.addListener('locationupdate', function() {
			me.setOwnPositionMarkerPosition(new google.maps.LatLng(this.getLatitude(), this.getLongitude()));
		});
		
		// add problem marker to map
		me.addProblemMarker(latlng, map);
    },
	
	addOwnPositionMarker: function(latlng, map) {
		var me = this;
		
		var ownPositionMarkerIcon = new google.maps.MarkerImage(
			'./resources/images/gmap-markers/own_position.png',
			// image size (after scaling)
			new google.maps.Size(20.0, 20.0),
			null,
			// image anchor to map in image (after scaling)
			new google.maps.Point(10.0, 10.0),
			// scale down image to half of the size to support retina displays
			new google.maps.Size(20.0, 20.0)
		);
		var ownPositionMarker = new google.maps.Marker({
			map: map,
			position: latlng,
			clickable: false,
			icon: ownPositionMarkerIcon,
			optimized: false
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
			// image size (after scaling)
			new google.maps.Size(49.0, 32.0),
			null,
			// image anchor to map in image (after scaling)
			new google.maps.Point(16.0, 32.0),
			// scale down image to half of the size to support retina displays
			new google.maps.Size(49.0, 32.0)
		);
		var marker = new google.maps.Marker({
			position: latlng,
			draggable: true,
			animation: google.maps.Animation.DROP,
			icon: me.getProblemMarkerImages()['undefined'],
			shadow: markerShadow,
			optimized: false
		});
		
		google.maps.event.addListener(marker, 'dragend', function() {
			var latlng = new google.maps.LatLng(marker.getPosition().lat(), marker.getPosition().lng());
			me.geocodePosition(latlng);
		});

		marker.setMap(map);
		me.setProblemMarker(marker);
	},
	
	onProblemTypeChange: function(field, newValue, oldValue, eOpts) {
		var me = this;
		
		if(field.getValue() == 'undefined') {
			me.getReportButton().setDisabled(true);
		} else {
			me.getReportButton().setDisabled(false);
		}
		
		// change marker icon
		var markerIcon = me.getProblemMarkerImages()[field.getValue()];
		me.getProblemMarker().setIcon(markerIcon);
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
		var me = this;
		var timestamp = new Timestamp();
		this.setTimestamp(timestamp);
		Ext.Msg.confirm('Defekt melden', '<p>' + me.getProblemTypeSelectField().getComponent().getValue() + ' wirklich melden?</p><p>Gewählte Adresse: ' + me.getAddressTextField().getValue() + '</p>', me.handleReportButtonConfirmResponse, me);		
	},
	
	handleReportButtonConfirmResponse: function(buttonId, value, opt) {
		var me = this;
		if(buttonId == 'yes') {
			try {
				// creating problem instance
				var status = Ext.getStore('Statuses').getById('new');
				var type = Ext.getStore('ProblemTypes').getById(me.getProblemTypeSelectField().getValue());
				// @TODO use correct id
				var id = Math.floor(Math.random()*101);

				// if id doens't exists in store
				if(!me.getProblemStore().getById(id)) {
					var problem = new FixMyStreet.model.Problem();
					problem.setData(
						{
							id: id,
							timestamp: me.getTimestamp().getTimestamp(),
							address: me.getCurrentAddress(),
							latitude: me.getReportMap().getGeo().getLatitude(),
							longitude: me.getReportMap().getGeo().getLongitude(),
							// @TODO why do I have to add getData() instead of record
							type: type.getData(),
							status: status.getData()
						}
					);

					// adding problem to store
					me.getProblemStore().add(problem);
				} else {
					throw new Error("Problem id already in store");
				}
				// resetting view data
				me.resetView();
			} catch(err) {
				console.log(err);
			}
		}
	},
	
	resetView: function() {
		this.getReportButton().setDisabled(true);
		this.getProblemTypeSelectField().setValue('undefined');
		
		// get current position
		var latlng = this.getCurrentLocationLatLng();
		
		this.getReportMap().setMapCenter(latlng);
		this.getProblemMarker().setPosition(latlng);
		this.geocodePosition(latlng);
		this.setTimestamp(null);
	},
	
	onCurrentLocationButtonTap: function(button, e, eOpts) {
		this.getReportMap().setMapCenter(this.getCurrentLocationLatLng());
	},
	
	getCurrentLocationLatLng: function() {
		var geo = this.getReportMap().getGeo();
		// get current position
		return new google.maps.LatLng(geo.getLatitude(), geo.getLongitude());
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
		
		me.problemStore = Ext.getStore('Problems');
		me.problemMarker = null;
		
		// prepare problem marker images
		me.problemMarkerImages = [];
		var currentProblemType = 0;
		Ext.getStore('ProblemTypes').each(function(record) {
			var problemTypeSpriteOffset = currentProblemType * 32.0;
			me.problemMarkerImages[record.getId()] =
				new google.maps.MarkerImage(
					'./resources/images/gmap-markers/sprite.png',
					// size of marker in sprite (after scaling)
					new google.maps.Size(32.0, 32.0),
					// origin of marker in sprite (from top left)
					new google.maps.Point(problemTypeSpriteOffset, 0.0),
					// image anchor to map in sprite (after scaling)
					new google.maps.Point(16.0, 32.0),
					// scale down image to half of the size to support retina displays
					new google.maps.Size(160.0, 32.0)
				);
			++currentProblemType;
		});
		
		me.ownPositionMarker = null;
		me.geocoder = new google.maps.Geocoder();
		me.currentAddress = null;
		me.timestamp = null;
		
		// @TODO remove debug code
		me.disableGeocoding = false;
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
	},
	getTimestamp: function() {
		return this.timestamp;
	},
	setTimestamp: function(timestamp) {
		this.timestamp = timestamp;
	},
	getProblemMarkerImages: function() {
		return this.problemMarkerImages;
	},
	setProblemMarkerImages: function(problemMarkerImages) {
		this.problemMarkerImages = problemMarkerImages;
	}
});