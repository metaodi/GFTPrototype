function SqlBuilder () {
	this.selectStmt = function(options) {
		options.fields = options.fields || "*";
		options = prepareOptions(options,['table']);
		
		var selectSql = "";
		selectSql += "SELECT " + options.fields;
		selectSql += " FROM " + options.table;
		if(options.condition) {
			var condition = trimCondition(options.condition);
			selectSql += " WHERE " + condition;
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
		
		var insertSql = "";
		insertSql += "INSERT INTO " + options.table;
		insertSql += " ( " + options.fields + " )";
		insertSql += " VALUES ( " + options.values + " )";
		
		return insertSql + ";";
	};
	
	this.updateStmt = function(options) {
		options = prepareOptions(options,['table','field','value','condition']);
		var condition = trimCondition(options.condition);
		
		var updateSql = "";
		updateSql += "UPDATE " + options.table;
		updateSql += " SET " + options.field + " = '" + options.value + "'";
		updateSql += " WHERE " + condition ;
		
		return updateSql + ";";
	};
	
	this.deleteStmt = function(options) {
		options = prepareOptions(options,['table','condition']);
		var condition = trimCondition(options.condition);
		
		var deleteSql = "";
		deleteSql += "DELETE FROM " + options.table;
		deleteSql += " WHERE " + condition;
		
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
		
		for (var i in required) {
			var option = required[i];
			if (options[option] === undefined) {
				throw new Error("Option '" + option + "' must be specified");
			}
		}
		return options;
	};
	
	var trimCondition = function(condition) {
		condition = $.trim(condition);
		return condition.replace(/^\s*AND\s*/i,'');
	}
	
	//create alias methods for unit tests
	this.__prepareOptions = prepareOptions;
	this.__trimCondition = trimCondition;
}