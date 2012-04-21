Ext.define('FixMyStreet.model.Problem', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',
		
        fields: [
			{ name: 'id', type: 'int' },
			{ name: 'timestamp', type: 'int' },
			{ name: 'address', type: 'string' },
            { name: 'latitude', type: 'string' },
            { name: 'longitude', type: 'string' },
			{ name: 'type', type: 'array' },
			{ name: 'status', type: 'array' }
        ],
	    hasOne: [
			{ model: 'ProblemType', name: 'type' },
			{ model: 'Status', name: 'status' }
		]
    }
});