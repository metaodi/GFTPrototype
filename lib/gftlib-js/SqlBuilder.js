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
		
		var values = [];
		for (var i in options.values) {
			values[i] = ($.isNumeric(options.values[i])) ? options.values[i] : "'" + options.values[i] + "'";
		}
		
		var insertSql = "";
		insertSql += "INSERT INTO " + options.table;
		insertSql += " ( " + options.fields.join(', ') + " )";
		insertSql += " VALUES ( " + values.join(", ") + " )";
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
		return true;
	}
	
	var getCondition = function(conditions) {
		if (isString(conditions)) {
			conditions = [conditions];
		}
		for (var i in conditions) {
			var condition = conditions[i];
			condition = $.trim(condition);
			condition = condition.replace(/\s*AND\s*/i,'');
			conditions[i] = condition;
		}
		return conditions.join(' AND ');
	}
	
	var splitToArray = function(str, separator) {
		if (!separator) {
			separator = ',';
		}
		if (isString(str)) {
			var regexStr = '\\s*'+RegExp.escape(separator)+'\\s*';
			var regex = new RegExp(regexStr,'g');
			str = str.replace(regex,separator);
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
	this.__splitToArray = splitToArray;
}

//source: http://simonwillison.net/2006/jan/20/escape/
RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}