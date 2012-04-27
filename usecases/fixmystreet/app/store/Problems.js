Ext.define('FixMyStreet.store.Problems', {
    extend: 'Ext.data.Store',
	
	config: {
		model: 'FixMyStreet.model.Problem',
		autoLoad: true,
		autoSync: true,
		
		// group problems by status and sort groups by sorting field of status
		grouper: {
			groupFn: function(record) {
				var statusStore = Ext.getStore('Status');
				return statusStore.getById(record.getData().status).getData().value;
			}
			// @TODO use sorting property
		},
		// sort problems by timestamp (descending)
		sorters: {
			property: 'timestamp',
			direction: 'DESC'
		}
	}
});
