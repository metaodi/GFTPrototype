function GftLib () {
	this.GFT_URL = 'http://www.google.com/fusiontables/api/query?';
	
	
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
	
    this.select = function(query, callback) {
		var queryUrlTail = '&jsonCallback=?'; // ? could be a function name
		var params = "sql=" + encodeURI(query + queryUrlTail);
		this.doPostJSONP(this.GFT_URL, params, callback);
    };
	
	this.convertToObject = function(gftData) {
		console.log(gftData);
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