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
        ],
		
		proxy: {
			type: 'fusiontables',
			settings: {
				tableId: FixMyStreet.util.Config.getFusionTable().tableId,
				idfield: FixMyStreet.util.Config.getFusionTable().idField,
				fields: FixMyStreet.util.Config.getFusionTable().fields,
				condition: 'userid = ' + FixMyStreet.util.Config.getUserId()
			}
		}
    }
});