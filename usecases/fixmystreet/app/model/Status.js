Ext.define('FixMyStreet.model.Status', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'key',
		
        fields: [
			// type of id property has to be auto
            { name: 'key', type: 'auto' },
            { name: 'value', type: 'string' }
        ]
    }
});