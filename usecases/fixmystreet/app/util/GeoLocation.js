// create FixMyStreet.util namespace
Ext.namespace('FixMyStreet.util');

/**
 * @class FixMyStreet.util.Geolocation
 * @extends Ext.util.Geolocation
 * 
 */

Ext.define('FixMyStreet.util.Geolocation', {
	extend: 'Ext.util.Geolocation',
	alias: 'widget.geolocation',
	
	config: {
		autoUpdate: false,
		available: false,

		listeners: {
			locationupdate: function(geo) {
				console.log("locationupdate");
				this.available = true;
				//traildevils.fireEvent('locationchanged');
			},
			locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
				this.available = false;
			}
		}
	}
});

