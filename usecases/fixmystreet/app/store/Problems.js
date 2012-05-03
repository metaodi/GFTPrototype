Ext.define('FixMyStreet.store.Problems', {
    extend: 'Ext.data.Store',
	
	config: {
		model: 'FixMyStreet.model.Problem',
		autoSync: true,
		
		// group problems by status and sort groups by sorting field of status
		grouper: {
			groupFn: function(record) {
				var statusStore = Ext.getStore('Status');
				return statusStore.getById(record.getData().status).getData().value;
			}
		},
		groupDir: 'DESC',
		
		// sort problems by timestamp (descending)
		sorters: {
			property: 'timestamp',
			direction: 'DESC'
		},
		
		proxy: {
			type: 'fusiontables',
			settings: {
				tableId: FixMyStreet.util.Config.getFusionTable().tableId,
				idfield: FixMyStreet.util.Config.getFusionTable().idField,
				fields: FixMyStreet.util.Config.getFusionTable().fields,
				condition: 'userid = ' + FixMyStreet.util.Config.getUserId()
			}
		},
		
		listeners: {
			beforeload: function() { console.log('store load') },
			beforesync: function() { console.log('store sync') }
		}
	}
});
