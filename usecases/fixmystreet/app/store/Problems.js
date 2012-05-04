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
		},
		
		proxy: {
			type: 'fusiontables',
			settings: {
				readTableId: FixMyStreet.util.Config.getFusionTable().readTableId,
				writeTableId: FixMyStreet.util.Config.getFusionTable().writeTableId,
				idfield: FixMyStreet.util.Config.getFusionTable().idField,
				fields: FixMyStreet.util.Config.getFusionTable().fields,
				condition: 'userid = ' + FixMyStreet.util.Config.getUserId()
			}
		},
		
		listeners: {
			addrecords: function() { Ext.Logger.log('[addrecords Event] sync'); this.sync(); },
			removerecords: function() { Ext.Logger.log('[removerecords Event] sync'); this.sync(); },
			beforeload: function() { Ext.Logger.log('store load') },
			beforesync: function() { Ext.Logger.log('store sync') }
		}
	}
});
