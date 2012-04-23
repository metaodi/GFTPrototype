Ext.define('FixMyStreet.util.Geolocation', {
	extend: 'Ext.util.Geolocation',
	
	config: {
		available: false,
		autoUpdate: false,
		
		listeners: {
			locationupdate: function(geo, eOpts) {
				this.available = true;
			},
			locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message, eOpts) {
				this.available = false;
			}
		}
	},
	
	isAvailable: function() {
		return this.available;
	}
});