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
        
        var records = operation.records;
		
        operation.setStarted();
        
		// insert record to fusion table here
		
        operation.setCompleted();
        operation.setSuccessful();

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },
	
	read: function(operation, callback, scope) {
		var me = this,
		param_arr = [];

		Ext.iterate(operation.params,function(a,i){
			param_arr.push(i);
		});

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
    }
});