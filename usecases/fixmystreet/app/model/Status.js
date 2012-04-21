Ext.define('FixMyStreet.model.Status', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'key',
		
        fields: [
            { name: 'key', type: 'string' },
            { name: 'value', type: 'string' },
            { name: 'sorting', type: 'int' }
        ]
    }
});