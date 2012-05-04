Ext.define('FixMyStreet.model.Problem', {
    extend: 'Ext.data.Model',
    config: {
		clientIdProperty: 'rowid',
		
        fields: [
			{ name: 'rowid', type: 'int' },
			{ name: 'userid', type: 'string' },
			{ name: 'timestamp', type: 'int' },
			{ name: 'address', type: 'string' },
            { name: 'latitude', type: 'string' },
            { name: 'longitude', type: 'string' },
			{ name: 'type', type: 'string' },
			{ name: 'status', type: 'string' }
        ]
    }
});