Ext.define('FixMyStreet.model.Problem', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'rowid',
		
        fields: [
			// type of id property has to be auto
			{ name: 'rowid', type: 'auto' },
			{ name: 'timestamp', type: 'int' },
			{ name: 'address', type: 'string' },
            { name: 'latitude', type: 'string' },
            { name: 'longitude', type: 'string' },
			{ name: 'type', type: 'array' },
			{ name: 'status', type: 'array' }
        ],
	    hasOne: [
			{ model: 'Type', name: 'type' },
			{ model: 'Status', name: 'status' }
		],
		
		proxy: {
			type: 'fusiontables',
			settings: {
				tableId: FixMyStreet.util.Config.getFusionTableId(),
				fields: 'ROWID, userId, externalId, timestamp, latitude, longitude, address, type, status'
			}
		}
    }
});