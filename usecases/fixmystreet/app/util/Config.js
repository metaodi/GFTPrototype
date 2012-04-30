Ext.define('FixMyStreet.util.Config', {
	singleton: true,

	config: {
		map: {
			lat: '47.36865',
			lng: '8.539183',
			defaultZoom: 13,
			reportZoom: 17
		},
		
		// poll for updates every 60 seconds
		pollingFrequency: 60000,
		
		fusionTable: {
			tableId: '1ggQAh0WF7J7myI27_Pv4anl0wBJQ7ERt4W5E6QQ',
			idField: 'rowid',
			fields: 'userid, timestamp, latitude, longitude, address, type, status'
		},
		
		userId: 1
	},
	
	constructor: function(config) {
		this.initConfig(config);
		return this;
	}
});