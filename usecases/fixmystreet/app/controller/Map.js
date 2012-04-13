Ext.define("FixMyStreet.controller.Map", {
    extend: "Ext.app.Controller",
	
    config: {
        refs: {
            gftmap: '#gftmap'
        },
        control: {
            gftmap: {
                maprender: "onMaprender"
            }
        }
    },
	
    onMaprender: function(comp, map) {
		var geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(this.getGftmap().getGeo().getLatitude(), this.getGftmap().getGeo().getLongitude());
		geocoder.geocode({'latLng': latlng}, function(results, status) {
			if(status == google.maps.GeocoderStatus.OK) {
				console.log(results);
				if (results[0]) {
					console.log("Du stehst auf folgender Strasse: " + results[0].formatted_address);
				}
			} else {
				alert("Geocoder failed due to: " + status);
			}
		});
		
		var marker = new google.maps.Marker({
			position: latlng,
			draggable: true,
			animation: google.maps.Animation.DROP
		});
		marker.setMap(this.getGftmap().getMap());
    },
	
    // Base Class functions.
    launch: function () {
        this.callParent(arguments);
    },
    init: function () {
        this.callParent(arguments);
    }
});