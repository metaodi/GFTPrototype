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
	
	//inherit docs
    create: function(operation, callback, scope) {
        console.log("create");
        var me = this;
        
		operation.setStarted();
		
        var records = operation.getRecords();
		
		// insert all given records
		for(var i = 0; i < records.length; i++) {
			var last = false;
			if(i == records.length - 1) {
				last = true;
			}
			me.insertRecord(records[i], operation, callback, scope, last);
		}
		
		operation.setCompleted();
		operation.setSuccessful();

		if (typeof callback == 'function') {
			callback.call(scope || this, operation);
		}
    },
	
	read: function(operation, callback, scope) {
		var me = this;

		var fields = operation.query || me.config.settings.fields || '*';
		
		var recieveData = function(data) {
			me.applyDataToModel(data, operation, callback, scope);
		};
		
		// recieve data from fusion table
		me.getGftLib().execSelect(recieveData, {
			table: me.config.settings.tableId,
			fields: fields
		}, me);
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
		
		//finish with callback
		if(typeof callback == "function") {
			callback.call(scope || me, operation);
		}
    },
	
	insertRecord: function(record, operation, callback, scope, last) {
		var me = this;
		var data = record.getData();
		var fields = [];
		var values = [];
		
		// extract fields and values from data
		for(var field in data) {
			// @TODO ugly way to ignore rowid
			if(field == 'rowid') {
				continue;
			}
			fields.push(field);

			// if value isn't a number
			if(isNaN(data[field])) {
				values.push("'" + data[field] + "'");
			} else {
				values.push(data[field]);
			}
		}
		
		var onInsertComplete = function(data) {
			if(data.rows) {
				var rowid = data.rows[0][0];
				record.data.rowid = rowid;
			}
		};
		
		// insert record to fusion table
		me.getGftLib().execInsert(onInsertComplete, {
			table: me.config.settings.tableId,
			fields: fields,
			values: values
		}, me);
	}
});