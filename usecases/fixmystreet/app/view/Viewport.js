Ext.define('FixMyStreet.view.Viewport', {
	extend: 'Ext.Container',

	config: {
		layout: {
			type: 'card'
		},
		items: [
				{
					xtype: 'titlebar',
					docked: 'top',
					title: 'FixMyStreet'
				},
				{
					xtype: 'tabpanel',
					tabBar: {
						docked: 'bottom'
					},
				items: [
					{
						xtype: 'panel',
						title: 'Melden',
						iconCls: 'locate',
						items: [
							{
								xtype: 'selectfield',
								label: 'Defekt melden...',
								options: [
									{text: 'Strassenlampe',  value: 'first'},
									{text: 'Schlagloch', value: 'second'},
									{text: 'Littering',  value: 'third'}
								]
							},
							{
								xtype: 'map',
								id: 'gftmap',
                                mapOptions: {
                                    zoom: 17
                                },
                                useCurrentLocation: true,
								listeners: {
									maprender: function(comp, map) {
										var geocoder = new google.maps.Geocoder();
										var latlng = new google.maps.LatLng(this.getGeo().getLatitude(), this.getGeo().getLongitude());
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
									}
								}
                            },
							{
								xtype: 'button',
								text: 'Jetzt melden',
								ui: 'action'
							},
						]
					},
					{
						xtype: 'panel',
						scrollable: true,
						title: 'Karte',
						iconCls: 'maps',
						items: []
					}
				]
			}
		]
	}
});
