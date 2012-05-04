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
				tableId: FixMyStreet.util.Config.getFusionTable().tableId,
				idfield: FixMyStreet.util.Config.getFusionTable().idField,
				fields: FixMyStreet.util.Config.getFusionTable().fields,
				condition: 'userid = ' + FixMyStreet.util.Config.getUserId()
			}
		},
		
		listeners: {
			addrecords: function() { console.log('[addrecords Event] sync'); this.sync(); },
			removerecords: function() { console.log('[removerecords Event] sync'); this.sync(); },
			beforeload: function() { console.log('store load') },
			beforesync: function() { console.log('store sync') }
		}
	}
	
	/**
	 * SENCHA BUGFIX: Do not remove all records when syncing the store
	 * URL: http://www.sencha.com/forum/showthread.php?177875-PR4-Store-content-is-cleared-everytime-read()-is-called
	 */
	/*
	onProxyLoad: function(operation) {
		console.log("[store] onProxyLoad");
		var me = this,
			records = operation.getRecords(),
			resultSet = operation.getResultSet(),
			successful = operation.wasSuccessful();

		if (resultSet) {
			me.setTotalCount(resultSet.getTotal());
		}

		if (successful) {
			if (operation.getAddRecords() !== true) {
				me.data.each(function(record) {
					record.unjoin(me);
				});
				me.data.clear();

				// This means we have to fire a clear event though
				me.fireEvent('clear', this);
			}

			// Now lets add the records without firing an addrecords event
			me.suspendEvents();
			me.add(records);
			me.resumeEvents();
			
			console.log("[store] refresh");
			// And finally fire a refresh event so any bound view can fully refresh itself
			me.fireEvent('refresh', this, this.data);
		}

		me.loading = false;
		me.fireEvent('load', this, records, successful);

		//this is a callback that would have been passed to the 'read' function and is optional
		Ext.callback(operation.getCallback(), operation.getScope() || me, [records, operation, successful]);
	}
	*/
});
