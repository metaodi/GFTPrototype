Ext.define('FixMyStreet.util.Config', {
	singleton: true,

	config: {
		map: {
			lat: '47.36865',
			lng: '8.539183',
			defaultZoom: 13,
			reportZoom: 17
		},
		
		// poll for updates every 30 seconds
		pollingFrequency: 10000,
		
		fusionTable: {
			writeTableId: '1EX1S20fZmhetpLuWf_i-Hi5qfx1412a3TbRV1Ac',
			readTableId: '1no3_lJ0CCazZVN6rlAY8vrtf9ejoz_xo0e7a9cY',
			fields: ['userid', 'timestamp', 'latitude', 'longitude', 'address', 'type', 'status'],
			idField: 'rowid',
			locationField: 'latitude',
			typeField: 'type'
		},
		
		userId: 0,
		logEnabled: true
	},
	
	constructor: function(config) {
		this.initConfig(config);
		return this;
	}
});