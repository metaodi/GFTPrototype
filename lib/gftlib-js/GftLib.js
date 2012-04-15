var global = this;

function GftLib () {
	if(this === global) { return new GftLib(); }
	
	var _this = this;
	var sqlBuilder = new SqlBuilder();
	
	_this.GFT_URL = 'https://www.googleapis.com/fusiontables/v1/query?';
	_this.INSERT_GFT_URL = 'http://' +window.location.hostname+'/gft/examples/RelayToGFT.php'; // needed because the request must be relayed via webserver
	_this.jsonUrlTail = '&callback=?'; // ? could be a function name
	
	_this.clientId = '63601791805.apps.googleusercontent.com';
    _this.apiKey = 'AIzaSyCAI2GoGWfLBvgygLKQp5suUk3RCG7r_ME';
    _this.scope = 'https://www.googleapis.com/auth/fusiontables';
	_this.accessToken = null;
	
	var doGet = function(url, params, callback) {
		var jqxhr = $.get(url, callback);
	};
	
	var doGetJSONP = function(url, params, callback) {
		var jqxhr = $.get(url + params, callback, "jsonp");
	};
	
	var doPost = function(url, params, callback) {
		var jqxhr = $.post(url, params, callback);
	};
	
	var doPostJSONP = function(url, params, callback) {
		var jqxhr = $.post(url, params, callback, "jsonp");
	};
	
	// Run OAuth 2.0 authorization.
	_this.auth = function(callback) {
		gapi.client.setApiKey(_this.apiKey);
		gapi.auth.authorize({
		  client_id: _this.clientId,
		  scope: _this.scope,
		  immediate: true
		}, function(result) {
			var success = false;
			if (result !== null) {
				success = true;
				_this.accessToken = result.access_token;
			}
			callback(success);
		});
	}
	
	var getUrlTail = function(include_json) {
		if (include_json == undefined) {
			include_json = true;
		}
		
		var jsonParam = '';
		if (include_json) {
			jsonParam = _this.jsonUrlTail;
		}
		
		var accessTokenParam = '';
		if(_this.accessToken) {
			accessTokenParam = '&access_token=' + _this.accessToken;
		}
		return accessTokenParam + jsonParam + '&key='+_this.apiKey;
	}
	
    var execSql = function(callback, query) {
		var params = "sql=" + encodeURI(query + getUrlTail());
		doPostJSONP(_this.GFT_URL, params, callback);
    };
	
	_this.execSelect = function(callback, options) {
		execSql(callback, sqlBuilder.select(options));
	};
	
	_this.getTableDescription = function(callback, tableId) {
		execSql(callback, sqlBuilder.describe(tableId));
	};
	
	_this.execInsert = function(callback, options) {
		var query = sqlBuilder.insert(options);
		var params = "sql=" + encodeURI(query + getUrlTail(false));
		doPost(_this.INSERT_GFT_URL, params, callback);
	};
	
	var convertToObject = function(gftData) {
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
	
	//create alias methods for unit tests
	this.__doGet = doGet;
	this.__doPost = doPost;
	this.__doGetJSONP = doGetJSONP;
	this.__doPostJSONP = doPostJSONP;
	this.__getUrlTail = getUrlTail;
	this.__convertToObject = convertToObject;
	this.__execSql = execSql;
	
	return _this;
}
