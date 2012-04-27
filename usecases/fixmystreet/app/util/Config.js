Ext.define('FixMyStreet.util.Config', {
	singleton: true,

	config: {
		map: {
			lat: '47.36865',
			lng: '8.539183',
			reportZoom: 17,
			defaultZoom: 13
		},
		
		// poll for updates every 60 seconds
		pollingFrequency: 60000
	},
	
	constructor: function(config) {
		this.initConfig(config);
		return this;
	}
});