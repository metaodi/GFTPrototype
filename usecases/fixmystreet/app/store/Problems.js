Ext.define('FixMyStreet.store.Problems', {
    extend: 'Ext.data.Store',
	
	config: {
		model: 'FixMyStreet.model.Problem',
		
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
		}
	}
});
