function SqlBuilder () {
	this.select = function(options) {
		options = this.prepareOptions(options);
		options.fields = options.fields || "*";
		
		if(!options.table) {
			throw new Error("Table must be specified");
		}
		
		var select = "";
		select += "SELECT " + options.fields;
		select += " FROM " + options.table;
		if(options.condition) {
			var condition = $.trim(options.condition);
			// if condition begins with AND -> remove AND
			if(condition.substr(0,3) == 'AND') {
				condition = condition.substr(4,condition.length);
			}
			select += " WHERE " + condition;
		}
		if(options.groupby) {
			select += " GROUP BY " + options.groupby;
		}
		if(options.orderby) {
			select += " ORDER BY " + options.orderby;
		}
		if(options.limit) {
			select += " LIMIT " + options.limit;
		}
		return select + ";";
	};
	
	this.insert = function(options) {
		options = this.prepareOptions(options);
		
		if(!options.table) {
			throw new Error("Table must be specified");
		}
		if(!options.fields) {
			throw new Error("Fields must be specified");
		}
		if(!options.values) {
			throw new Error("Values must be specified");
		}
		
		var insert = "";
		insert += "INSERT INTO " + options.table;
		insert += " ( " + options.fields + " )";
		insert += " VALUES ( " + options.values + " )";
		
		return insert + ";";
	};
	
	this.deleteRow = function(options) {
		options = this.prepareOptions(options);
		
		if(!options.table) {
			throw new Error("Table must be specified");
		}
		
		var deleteSql = "";
		deleteSql += "DELETE FROM " + options.table;
		if(options.condition) {
			var condition = $.trim(options.condition);
			// if condition begins with AND -> remove AND
			if(condition.substr(0,3) == 'AND') {
				condition = condition.substr(4,condition.length);
			}
			deleteSql += " WHERE " + condition;
		}
		
		return deleteSql + ";";
	};
	
	this.describe = function(tableId) {
		return "DESCRIBE " + tableId + ";";
	};
	
	this.prepareOptions = function(options) {
		options = options || {};
		options.table     = options.table     || null;
		options.fields    = options.fields    || null;
		options.values    = options.values    || null;
		options.condition = options.condition || null;
		options.groupby   = options.groupby   || null;
		options.orderby   = options.orderby   || null;
		options.limit     = options.limit     || null;
		
		return options;
	};
}