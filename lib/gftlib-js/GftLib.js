function GftLib () {
	this.GFT_URL = 'http://www.google.com/fusiontables/api/query?';
	this.jsonUrlTail = '&jsonCallback=?'; // ? could be a function name
	var sqlBuilder = new SqlBuilder();
	
	this.doGet = function(url, params, callback) {
		var jqxhr = $.get(url, callback);
	};
	
	this.doGetJSONP = function(url, params, callback) {
		var jqxhr = $.get(url + params, callback, "jsonp");
	};
	
	this.doPost = function(url, params, callback) {
		var jqxhr = $.post(url, params, callback);
	};
	
	this.doPostJSONP = function(url, params, callback) {
		var jqxhr = $.post(url, params, callback, "jsonp");
	};
	
    this.execSql = function(callback, query, accessToken) {
		var accessTokenParam = '';
		if(accessToken) {
			accessTokenParam = '&access_token=' + accessToken;
		}
		var params = "sql=" + encodeURI(query + accessTokenParam + this.jsonUrlTail);
		this.doPostJSONP(this.GFT_URL, params, callback);
    };
	
	this.execSelect = function(callback, options, accessToken) {
		this.execSql(callback, sqlBuilder.select(options), accessToken);
	};
	
	this.getTableDescription = function(callback, tableId, accessToken) {
		this.execSql(callback, sqlBuilder.describe(tableId), accessToken);
	};
	
	this.execInsert = function(callback, options, accessToken) {
		// TODO: doenst work because request is set with GET instead of POST
		this.execSql(callback, sqlBuilder.insert(options), accessToken);
	};
	
	this.convertToObject = function(gftData) {
		var rows = gftData.table.rows;
		var cols = gftData.table.cols;
		var allObjects = new Array();
		
		for (var rowNr = 0; rowNr < rows.length; rowNr++) {
			var gftObj = new Object();
			for (var colNr = 0; colNr < cols.length; colNr++) {
				var colName = cols[colNr];
				// remove spaces
				colName = colName.replace(/\s/g, "")
				gftObj[colName.toLowerCase()] = rows[rowNr][colNr];
			}
			allObjects.push(gftObj);
		}
		
		return allObjects;
	};
}
