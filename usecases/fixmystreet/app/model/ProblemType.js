Ext.define('FixMyStreet.model.ProblemType', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'value',
		
        fields: [
            { name: 'text', type: 'string' },
            { name: 'value', type: 'string' }
        ]
    }
});