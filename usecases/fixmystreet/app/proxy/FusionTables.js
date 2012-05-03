Ext.define('FixMyStreet.proxy.FusionTables', {
    extend: 'Ext.data.proxy.Proxy',

    alias: 'proxy.fusiontables',
	
	constructor: function(config) {
        Ext.data.Proxy.superclass.constructor.call(this, config);
        var me = this;
		
		me.gftLib = new GftLib();
    },
	getGftLib: function() {
		return this.gftLib;
	},
	
    create: function(operation, callback, scope) {
		console.log('[gftproxy] create');
        var me = this;
        
		operation.setStarted();
		
        var records = operation.getRecords();
		
		// insert all given records
		for(var i = 0; i < records.length; i++) {
			me.insertRecord(records[i]);
		}
		
		operation.setCompleted();
		operation.setSuccessful();
		
		if (typeof callback == 'function') {
			callback.call(scope || this, operation);
		}
    },
	
	read: function(operation, callback, scope) {
		console.log('[gftproxy] read');
		var me = this;

		var fields = operation.query || me.config.settings.idfield + ', ' + me.config.settings.fields || '*';
		
		var recieveData = function(data) {
			console.log(data);
			me.applyDataToModel(data, operation, callback, scope);
		};
		
		// recieve data from fusion table
		me.getGftLib().execSelect(recieveData, {
			table: me.config.settings.tableId,
			fields: fields,
			condition: me.config.settings.condition
		}, me);
    },
	
	destroy: function(operation, callback, scope) {
		console.log('[gftproxy] destroy');
		var me = this;
		
		var records = operation.getRecords();
		
		// delete all given records
		for(var i = 0; i < records.length; i++) {
			me.deleteRecord(records[i]);
		}

		operation.setCompleted();
		operation.setSuccessful();

		if (typeof callback == 'function') {
			callback.call(scope || this, operation);
		}
	},
	
	parseData: function(data) {
		var me = this;
		var objs = me.getGftLib().convertToObject(data);
		var records = [];
		
		for(var problem in objs) {
			var record = Ext.create(me.getModel(), objs[problem]);
			records.push(record);
		}
		
		return records;
	},
	
	applyDataToModel: function(data, operation, callback, scope) {
		var me = this;

		var parsedData = me.parseData(data);
		var resultSet = new Ext.data.ResultSet({
			records: parsedData,
			total: parsedData.length,
			loaded: true
		});
		
		operation.setResultSet(resultSet);
		operation.setSuccessful();
		operation.setCompleted();
		
		// finish with callback
		if(typeof callback == "function") {
			callback.call(scope || me, operation);
		}
    },
	
	insertRecord: function(record) {
		var me = this;
		var data = record.getData();
		var fields = [];
		var values = [];
		
		// extract fields and values from data
		for(var field in data) {
			if(me.config.settings.fields.indexOf(field) > -1) {
				fields.push(field);
				values.push(data[field]);
			}
		}
		
		var onInsertComplete = function(data) {
			if(data.rows) {
				// use correct id from table for record id
				var idfield = data.rows[0][0];
				record.data[me.config.settings.idfield] = idfield;
				record.commit();
			}
		};
		
		// insert record to fusion table
		me.getGftLib().execInsert(onInsertComplete, {
			table: me.config.settings.tableId,
			fields: fields,
			values: values
		}, me);
	},
	
	deleteRecord: function(record) {
		var me = this;
		var data = record.getData();
		
		// delete record from fusion table
		me.getGftLib().execDelete(Ext.emptyFn, {
			table: me.config.settings.tableId,
			condition: me.config.settings.idfield + " = '" + data[me.config.settings.idfield] + "'"
		}, me);
	}
});