function SqlBuilder () {
	this.selectStmt = function(options) {
		options.fields = options.fields || ["*"];
		options = prepareOptions(options,['table']);
		
		var selectSql = "";
		selectSql += "SELECT " + options.fields.join(', ');
		selectSql += " FROM " + options.table;
		if(options.condition) {
			selectSql += " WHERE " + options.condition;
		}
		if(options.groupby) {
			selectSql += " GROUP BY " + options.groupby;
		}
		if(options.orderby) {
			selectSql += " ORDER BY " + options.orderby;
		}
		if(options.limit) {
			selectSql += " LIMIT " + options.limit;
		}
		return selectSql + ";";
	};
	
	this.insertStmt = function(options) {
		options = prepareOptions(options,['table','fields','values']);
		checkFieldsAndValues(options);
		
		var insertSql = "";
		insertSql += "INSERT INTO " + options.table;
		insertSql += " ( " + options.fields.join(', ') + " )";
		insertSql += " VALUES ( '" + options.values.join("', '") + "' )";
		return insertSql + ";";
	};
	
	this.updateStmt = function(options) {
		options = prepareOptions(options,['table','fields','values','condition']);
		checkFieldsAndValues(options);
		
		var setter = [];
		for (var i in options.fields) {
			var value = (isNaN(options.values[i])) ? "'" + options.values[i] + "'" : options.values[i];
			setter[i] = options.fields[i] + " = " + value;
		}
		
		var updateSql = "";
		updateSql += "UPDATE " + options.table;
		updateSql += " SET " + setter.join(", ");
		updateSql += " WHERE " + options.condition ;
		return updateSql + ";";
	};
	
	this.deleteStmt = function(options) {
		options = prepareOptions(options,['table','condition']);
		
		var deleteSql = "";
		deleteSql += "DELETE FROM " + options.table;
		deleteSql += " WHERE " + options.condition;
		return deleteSql + ";";
	};
	
	this.describeStmt = function(options) {
		options = prepareOptions(options,['table']);
		return "DESCRIBE " + options.table + ";";
	};
	
	this.createViewStmt = function(options) {
		options = prepareOptions(options,['viewName', 'query']);
		return "CREATE VIEW " + options.viewName + " AS (" + options.query + ");";
	}
	
	var prepareOptions = function(options,required) {
		options = options || {};
		if (options.fields !== undefined) {
			options.fields = splitToArray(options.fields,',');
		}
		if (options.values !== undefined) {
			options.values = splitToArray(options.values,',');
		}
		
		if (options.condition !== undefined) {
			options.condition = getCondition([options.condition]);
		} else if (options.condition === undefined && options.conditions !== undefined) {
			options.condition = getCondition(options.conditions);
		}
		
		for (var i in required) {
			var option = required[i];
			if (options[option] === undefined) {
				throw new Error("Option '" + option + "' must be specified");
			}
		}
		return options;
	};
	
	var checkFieldsAndValues = function(options) {
		var numFields = options.fields.length;
		var numValues = options.values.length;
		
		if (numFields !== numValues) {
			throw new Error("Fields (" + numFields + ") and values arrays (" + numValues+") must be of equal length");
		}
	}
	
	var getCondition = function(conditions) {
		var condition = (isString(conditions)) ? conditions : conditions.join(' AND ');
		condition = $.trim(condition);
		return condition.replace(/^\s*AND\s*/i,'');
	}
	
	var splitToArray = function(str, separator) {
		if (isString(str)) {
			str = str.replace(/\s*,\s*/g,',');
			str = str.split(separator);
		} 
		return str;
	}
	
	var isString = function(str) {
		return (typeof str === 'string' || (typeof str === 'object' && str instanceof String));
	}
	
	//create alias methods for unit tests
	this.__prepareOptions = prepareOptions;
	this.__checkFieldsAndValues = checkFieldsAndValues;
	this.__getCondition = getCondition;
	this.__isString = isString;
}