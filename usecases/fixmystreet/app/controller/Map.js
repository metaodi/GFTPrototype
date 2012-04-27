Ext.define("FixMyStreet.controller.Map", {
	extend: "Ext.app.Controller",
	
	onMapRender: function(mapComp, map, eOpts) {
		var me = this;
		me.setMapRendered(true);
		
		var geo = FixMyStreet.geo;
		mapComp.setGeo(geo);
		
		// disable zoom control if browser is running on iOS (use pinching gesture instead)
		if(Ext.os.is.iOS) {
			map.setOptions({
				zoomControl: false
			});
		}
		
		var latlng = this.getCurrentLocationLatLng(mapComp);
		
		if(geo.isAvailable()) {
			// add own position marker to map
			me.addOwnPositionMarker(latlng, map);
			geo.addListener('locationupdate', function() {
				me.setOwnPositionMarkerPosition(new google.maps.LatLng(this.getLatitude(), this.getLongitude()));
			});
		}
		
		// center map to current position
		mapComp.setMapCenter(latlng);
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
			// marker should be behind every other marker
			zIndex: 0,
			icon: ownPositionMarkerIcon,
			// do not optimize marker image to recieve retina display support
			optimized: false
		});
		me.setOwnPositionMarker(ownPositionMarker);
	},
	setOwnPositionMarkerPosition: function(latlng) {
		var ownPositionMarker = this.getOwnPositionMarker();
		if(ownPositionMarker) {
			ownPositionMarker.setPosition(latlng);
		}
	},
	
	getCurrentLocationLatLng: function(mapComp) {
		var geo = mapComp.getGeo();
		if(geo && geo.isAvailable()) {
			return new google.maps.LatLng(geo.getLatitude(), geo.getLongitude());
		} else {
			return mapComp.getMap().getCenter();
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
		
		me.mapRendered = false;
		
		// prepare problem marker images
		me.problemMarkerImages = [];
		var currentType = 0;
		// marker images created with: http://mapicons.nicolasmollet.com/
		Ext.getStore('Types').each(function(record) {
			var typeSpriteOffset = currentType * 32.0;
			me.problemMarkerImages[record.getId()] =
				new google.maps.MarkerImage(
					'./resources/images/gmap-markers/sprite.png',
					// size of marker in sprite (after scaling)
					new google.maps.Size(32.0, 32.0),
					// origin of marker in sprite (from top left)
					new google.maps.Point(typeSpriteOffset, 0.0),
					// image anchor to map in sprite (after scaling)
					new google.maps.Point(16.0, 32.0),
					// scale down image to half of the size to support retina displays
					new google.maps.Size(160.0, 32.0)
				);
			++currentType;
		});
		
		me.ownPositionMarker = null;
		
		// prepare marker shadow
		// marker shadow created with: http://www.cycloloco.com/shadowmaker/shadowmaker.htm
		me.markerShadow = new google.maps.MarkerImage(
			'./resources/images/gmap-markers/shadow.png',
			// image size (after scaling)
			new google.maps.Size(49.0, 32.0),
			null,
			// image anchor to map in image (after scaling)
			new google.maps.Point(16.0, 32.0),
			// scale down image to half of the size to support retina displays
			new google.maps.Size(49.0, 32.0)
		);
    },
	
	getMapRendered: function() {
		return this.mapRendered;
	},
	setMapRendered: function(mapRendered) {
		this.mapRendered = mapRendered;
	},
	getOwnPositionMarker: function() {
		return this.ownPositionMarker;
	},
	setOwnPositionMarker: function(ownPositionMarker) {
		this.ownPositionMarker = ownPositionMarker;
	},
	getProblemMarkerImagesById: function(problemId) {
		return this.problemMarkerImages[problemId];
	},
	setProblemMarkerImages: function(problemMarkerImages) {
		this.problemMarkerImages = problemMarkerImages;
	},
	getMarkerShadow: function() {
		return this.markerShadow;
	},
	setMarkerShadow: function(markerShadow) {
		this.markerShadow = markerShadow;
	}
});