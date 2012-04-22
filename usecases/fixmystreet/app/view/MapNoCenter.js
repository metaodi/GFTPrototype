Ext.define('FixMyStreet.view.MapNoCenter', {
	extend: 'Ext.Map',
	alias: 'widget.mapnocenter',
	
	// don't center map on geo update
	onGeoUpdate: function(geo) {
		var me = this;
		if (geo) {
            var map = me.getMap();
            var gm = (window.google || {}).maps;
			
			if (gm) {
				if (!me.isPainted()) {
					me.un('painted', 'onGeoUpdate', this);
					me.on('painted', 'onGeoUpdate', this, { delay: 50, single: true, args: [geo] });
					return;
				}
				
				if (!map) {
					me.renderMap();
				}
			}
        }
	}
});