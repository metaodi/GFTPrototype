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
		pollingFrequency: 30000,
		
		fusionTable: {
			writeTableId: '1D0UaUJoYStOuQxNhO1IZoN9X8JCBHvpza0nbuZo',
			readTableId: '1D0UaUJoYStOuQxNhO1IZoN9X8JCBHvpza0nbuZo',
			fields: ['userid', 'timestamp', 'location', 'address', 'type', 'status'],
			idField: 'rowid',
			locationField: 'location',
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