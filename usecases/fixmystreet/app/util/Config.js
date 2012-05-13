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
			writeTableId: '1E-hyhqyj9CCBj53F3Pb8jExUqoAqhZWWHFrxnNU',
			readTableId: '1F7rJMZ0wD3MS7TXu98fqYsHG1sULL8dszHI_qzQ',
			fields: ['userid', 'timestamp', 'location', 'address', 'type', 'status'],
			idField: 'rowid',
			locationField: 'location',
			latlngSeparator: ' ',
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