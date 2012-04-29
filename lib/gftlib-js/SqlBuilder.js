function SqlBuilder () {
	this.selectStmt = function(options) {
		options.fields = options.fields || "*";
		options = prepareOptions(options,['table']);
		
		var select = "";
		select += "SELECT " + options.fields;
		select += " FROM " + options.table;
		if(options.condition) {
			var condition = trimCondition(options.condition);
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
	
	this.insertStmt = function(options) {
		options = prepareOptions(options,['table','fields','values']);
		
		var insert = "";
		insert += "INSERT INTO " + options.table;
		insert += " ( " + options.fields + " )";
		insert += " VALUES ( " + options.values + " )";
		
		return insert + ";";
	};
	
	this.deleteStmt = function(options) {
		options = prepareOptions(options,['table']);
		
		var deleteSql = "";
		deleteSql += "DELETE FROM " + options.table;
		if(options.condition) {
			var condition = trimCondition(options.condition);
			deleteSql += " WHERE " + condition;
		}
		
		return deleteSql + ";";
	};
	
	this.describeStmt = function(table) {
		if(!table) {
			throw new Error("Table must be specified");
		}
		return "DESCRIBE " + table + ";";
	};
	
	var prepareOptions = function(options,required) {
		options = options || {};
		options.table     = options.table     || null;
		options.fields    = options.fields    || null;
		options.values    = options.values    || null;
		options.condition = options.condition || null;
		options.groupby   = options.groupby   || null;
		options.orderby   = options.orderby   || null;
		options.limit     = options.limit     || null;
		
		for (var i in required) {
			var option = required[i];
			if (options[option] === null) {
				throw new Error("Option '" + option + "' must be specified");
			}
		}
		return options;
	};
	
	var trimCondition = function(condition) {
		condition = $.trim(condition);
		return condition.replace(/^AND /i,'');
	}
}