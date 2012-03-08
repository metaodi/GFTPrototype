function GftLib () {
	this.GFT_URL = 'http://www.google.com/fusiontables/api/query?';
	this.jsonUrlTail = '&jsonCallback=?'; // ? could be a function name
	
	this.doGet = function(url, params, callback) {
		var jqxhr = $.get(url, callback);
	}
	
	this.doGetJSONP = function(url, params, callback) {
		var jqxhr = $.get(url + params, callback, "jsonp");
	}
	
	this.doPost = function(url, params, callback) {
		var jqxhr = $.post(url, params, callback);
	}
	
	this.doPostJSONP = function(url, params, callback) {
		var jqxhr = $.post(url, params, callback, "jsonp");
	}
	
    this.execSql = function(query, callback) {
		var params = "sql=" + encodeURI(query + this.jsonUrlTail);
		this.doPostJSONP(this.GFT_URL, params, callback);
    };
	
	this.execSelect = function(callback, fields, table, condition, orderby, groupby, limit) {
		this.execSql(this.select(fields, table, condition, orderby, groupby, limit), callback);
	}
	
	this.select = function(fields, table, condition, orderby, groupby, limit) {
		if(arguments.length >= 2) {
			var select = "";
			select += "SELECT " + fields;
			select += " FROM " + table;
			if(condition) {
				condition = $.trim(condition);
				// if condition begins with AND -> remove AND
				if(condition.substr(0,3) == 'AND') {
					condition = condition.substr(4,condition.length);
				}
				select += " WHERE " + condition;
			}
			if(orderby) {
				select += " ORDERBY " + orderby;
			}
			if(groupby) {
				select += " GROUPBY " + groupby;
			}
			if(limit) {
				select += " LIMIT " + limit;
			}
			return select + ";";
		}
		throw new Error("two or more parameters required");
	}
	
	this.convertToObject = function(gftData) {
		var rows = gftData.table.rows;
		var cols = gftData.table.cols;
		var allObjects = new Array();
		
		for (var rowNr = 0; rowNr < rows.length; rowNr++) {
			var gftObj = new Object();
			for (var colNr = 0; colNr < cols.length; colNr++) {
				var colName = cols[colNr];
				gftObj[colName.toLowerCase()] = rows[rowNr][colNr];
			}
			allObjects.push(gftObj);
		}
		
		return allObjects;
	}
}