Ext.define('FixMyStreet.model.Problem', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'rowid',
		
        fields: [
			// type of id property has to be auto
			{ name: 'rowid', type: 'auto' },
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