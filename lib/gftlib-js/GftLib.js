function GftLib () {
	this.GFT_URL = 'http://www.google.com/fusiontables/api/query?';
	this.jsonUrlTail = '&jsonCallback=?'; // ? could be a function name
	var sqlBuilder = new SqlBuilder();
	
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
	
    this.execSql = function(callback, query) {
		var params = "sql=" + encodeURI(query + this.jsonUrlTail);
		this.doPostJSONP(this.GFT_URL, params, callback);
    };
	
	this.execSelect = function(callback, fields, table, condition, orderby, groupby, limit) {
		this.execSql(callback, sqlBuilder.select(fields, table, condition, orderby, groupby, limit));
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
