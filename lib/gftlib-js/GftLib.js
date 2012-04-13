function GftLib () {
	this.GFT_URL = 'https://www.googleapis.com/fusiontables/v1/query?';
	this.INSERT_GFT_URL = 'http://' +window.location.hostname+'/gft/examples/RelayToGFT.php'; // needed because the request must be relayed via webserver
	this.jsonUrlTail = '&callback=?'; // ? could be a function name
	
	this.clientId = '63601791805.apps.googleusercontent.com';
    this.apiKey = 'AIzaSyCAI2GoGWfLBvgygLKQp5suUk3RCG7r_ME';
    this.scope = 'https://www.googleapis.com/auth/fusiontables';
	this.accessToken = null;
	
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
	
	// Run OAuth 2.0 authorization.
	this.auth = function(callback) {
		var parentThis = this;
		gapi.client.setApiKey(this.apiKey);
		gapi.auth.authorize({
		  client_id: this.clientId,
		  scope: this.scope,
		  immediate: true
		}, function(result) {
			var success = false;
			if (result !== null) {
				success = true;
				parentThis.accessToken = result.access_token;
			}
			callback(success);
		});
	}
	
	this.getUrlTail = function(include_json) {
		if (include_json == undefined) {
			include_json = true;
		}
		
		var jsonParam = '';
		if (include_json) {
			jsonParam = this.jsonUrlTail;
		}
		
		var accessTokenParam = '';
		if(this.accessToken) {
			accessTokenParam = '&access_token=' + this.accessToken;
		}
		return accessTokenParam + jsonParam + '&key='+this.apiKey;
	}
	
    this.execSql = function(callback, query) {
		var params = "sql=" + encodeURI(query + this.getUrlTail());
		this.doPostJSONP(this.GFT_URL, params, callback);
    };
	
	this.execSelect = function(callback, options) {
		this.execSql(callback, sqlBuilder.select(options));
	};
	
	this.getTableDescription = function(callback, tableId) {
		this.execSql(callback, sqlBuilder.describe(tableId));
	};
	
	this.execInsert = function(callback, options) {
		var query = sqlBuilder.insert(options);
		var params = "sql=" + encodeURI(query + this.getUrlTail(false));
		this.doPost(this.INSERT_GFT_URL, params, callback);
	};
	
	this.convertToObject = function(gftData) {
		var rows = gftData.rows;
		var cols = gftData.columns;
		var allObjects = new Array();
		
		for (var rowNr = 0; rowNr < rows.length; rowNr++) {
			var gftObj = new Object();
			for (var colNr = 0; colNr < cols.length; colNr++) {
				var colName = cols[colNr];
				colName = colName.replace(/\s/g, ""); // remove spaces
				gftObj[colName.toLowerCase()] = rows[rowNr][colNr];
			}
			allObjects.push(gftObj);
		}
		
		return allObjects;
	};
}
