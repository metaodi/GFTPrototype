Ext.define('FixMyStreet.model.Type', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'value',
		
        fields: [
			// type of id property has to be auto
            { name: 'value', type: 'auto' },
            { name: 'text', type: 'string' }
        ]
    }
});