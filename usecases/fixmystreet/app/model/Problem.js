Ext.define('FixMyStreet.model.Problem', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'rowid',
		
        fields: [
			{ name: 'rowid', type: 'auto' },
			{ name: 'userid', type: 'string' },
			{ name: 'timestamp', type: 'int' },
			{ name: 'address', type: 'string' },
            { name: 'location', type: 'string' },
			{ name: 'type', type: 'string' },
			{ name: 'status', type: 'string' }
        ]
    }
});