var global = this;

function GftLib () {
	if(this === global) { return new GftLib(); }
	
	var _this = this;
	var sqlBuilder = new SqlBuilder();
	
	_this.GFT_PATH = '/fusiontables/v1/query';
	_this.clientId = '63601791805.apps.googleusercontent.com';
    _this.apiKey = 'AIzaSyCAI2GoGWfLBvgygLKQp5suUk3RCG7r_ME';
    _this.scope = 'https://www.googleapis.com/auth/fusiontables';
	_this.accessToken = null;
	
	// sends an ajax request to the Google API
	_this.sendRequest = function(request, callback) {
		var restRequest = gapi.client.request(request);
		restRequest.execute(callback);
	}
	
	// Run OAuth 2.0 authorization.
	_this.auth = function(callback) {
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
	
	var readRequest = function(callback, query) {
		var params = "sql=" + encodeURI(query);
		_this.sendRequest({
			path: _this.GFT_PATH,
			params: { 'sql': query }
		}, callback);
	}
	
	var writeRequest = function(callback, query) {
		var authCb = function(success) {
			if (success) {
				var params = "sql=" + encodeURI(query);
				_this.sendRequest({
					path: _this.GFT_PATH,
					body: params,
					headers: {
					  'Content-Type': 'application/x-www-form-urlencoded',
					  'Content-Length': params.length
					},
					method: 'POST'
				}, callback);
			} else {
				callback(null,'Auth failed');
			}
		}
		_this.auth(authCb);
	}
	
	_this.execSql = function(callback, query) {
		readRequest(callback,query);
    };
	
	_this.execSelect = function(callback, options) {
		readRequest(callback, sqlBuilder.select(options));
	};
	
	_this.getTableDescription = function(callback, tableId) {
		_readRequest(callback, sqlBuilder.describe(tableId));
	};
	
	_this.execInsert = function(callback, options) {
		writeRequest(callback, sqlBuilder.insert(options));
	};
	
	_this.convertToObject = function(gftData) {
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
	this.__readRequest = readRequest;
	this.__writeRequest = writeRequest;
	
	//set API key
	gapi.client.setApiKey(_this.apiKey);
	
	return _this;
}
